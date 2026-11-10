using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ClinicManagement.Api.Helpers;
using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string CookieName = "clinic_refresh";
    private const int AccessTokenLifetimeSeconds = 15 * 60; // 15 phút
    private const int RefreshTokenLifetimeDays = 7; // 7 ngày

    private readonly DataContext _context;
    private readonly IPasswordHasher<StaffUsers> _passwordHasher;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        DataContext context,
        IPasswordHasher<StaffUsers> passwordHasher,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
        _environment = environment;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // 1. Validation
        if (!ModelState.IsValid || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new ProblemDetails
            {
                Status = 400,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."
            });
        }

        var ip = ClientInfoHelper.GetClientIp(HttpContext);
        var ua = Request.Headers.UserAgent.ToString();
        var device = ClientInfoHelper.GetDevice(ua);
        var browser = ClientInfoHelper.GetBrowser(ua);
        var now = DateTime.UtcNow;

        // 2. Truy vấn user bằng LINQ
        var username = request.Username.Trim();
        var user = await _context.StaffUsers
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Username == username);

        // 3. Kiểm tra user tồn tại, trạng thái ACTIVE và vai trò hợp lệ
        if (user == null || user.Status != "ACTIVE" || !IsAllowedRole(user.Role?.Code))
        {
            _context.StaffAccessLogs.Add(new StaffAccessLogs
            {
                StaffId = user?.Id,
                Username = username,
                Activity = "LOGIN",
                Status = "FAILED",
                AccessTime = now,
                IpAddress = ip,
                Device = device,
                Browser = browser,
                PagePath = null
            });
            await _context.SaveChangesAsync();

            return Unauthorized(new ProblemDetails
            {
                Status = 401,
                Title = "Đăng nhập thất bại",
                Detail = "Tên đăng nhập hoặc mật khẩu không chính xác."
            });
        }

        // 4. Kiểm tra mật khẩu bằng PasswordHasher
        var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verifyResult == PasswordVerificationResult.Failed)
        {
            _context.StaffAccessLogs.Add(new StaffAccessLogs
            {
                StaffId = user.Id,
                Username = username,
                Activity = "LOGIN",
                Status = "FAILED",
                AccessTime = now,
                IpAddress = ip,
                Device = device,
                Browser = browser,
                PagePath = null
            });
            await _context.SaveChangesAsync();

            return Unauthorized(new ProblemDetails
            {
                Status = 401,
                Title = "Đăng nhập thất bại",
                Detail = "Tên đăng nhập hoặc mật khẩu không chính xác."
            });
        }

        // 5. Tạo tokens và lưu session
        var refreshToken = GenerateRefreshToken();
        var session = new StaffSessions
        {
            StaffId = user.Id,
            RefreshTokenHash = HashToken(refreshToken),
            CreatedAt = now,
            ExpiresAt = now.AddDays(RefreshTokenLifetimeDays)
        };

        _context.StaffSessions.Add(session);
        user.LastLoginAt = now;
        user.UpdatedAt = now;

        // Ghi nhật ký đăng nhập thành công
        _context.StaffAccessLogs.Add(new StaffAccessLogs
        {
            StaffId = user.Id,
            Username = user.Username,
            Activity = "LOGIN",
            Status = "SUCCESS",
            AccessTime = now,
            IpAddress = ip,
            Device = device,
            Browser = browser,
            PagePath = null
        });

        await _context.SaveChangesAsync();

        // 6. Tạo JWT Access Token
        var accessToken = GenerateAccessToken(user, session.Id);

        // 7. Thiết lập Cookie HttpOnly cho Refresh Token
        SetRefreshCookie(refreshToken);

        // 8. Trả kết quả
        return Ok(new LoginResponse
        {
            AccessToken = accessToken,
            TokenType = "Bearer",
            ExpiresIn = AccessTokenLifetimeSeconds,
            User = MapToUserResponse(user)
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var subClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!long.TryParse(subClaim, out var staffId))
        {
            return Unauthorized();
        }

        var user = await _context.StaffUsers
            .AsNoTracking()
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == staffId && x.Status == "ACTIVE");

        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(MapToUserResponse(user));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken()
    {
        var token = Request.Cookies[CookieName];
        if (string.IsNullOrWhiteSpace(token))
        {
            return Unauthorized();
        }

        var hash = HashToken(token);
        var now = DateTime.UtcNow;

        // Tìm phiên hợp lệ
        var session = await _context.StaffSessions
            .Include(x => x.Staff)
            .ThenInclude(x => x.Role)
            .FirstOrDefaultAsync(x => x.RefreshTokenHash == hash);

        if (session == null || session.RevokedAt != null || session.ExpiresAt <= now
            || session.Staff.Status != "ACTIVE" || !IsAllowedRole(session.Staff.Role?.Code))
        {
            ClearRefreshCookie();
            return Unauthorized();
        }

        // Xoay vòng token: thu hồi phiên cũ, tạo phiên mới
        session.RevokedAt = now;

        var newRefreshToken = GenerateRefreshToken();
        var newSession = new StaffSessions
        {
            StaffId = session.StaffId,
            RefreshTokenHash = HashToken(newRefreshToken),
            CreatedAt = now,
            ExpiresAt = now.AddDays(RefreshTokenLifetimeDays)
        };

        _context.StaffSessions.Add(newSession);
        await _context.SaveChangesAsync();

        var newAccessToken = GenerateAccessToken(session.Staff, newSession.Id);
        SetRefreshCookie(newRefreshToken);

        return Ok(new LoginResponse
        {
            AccessToken = newAccessToken,
            TokenType = "Bearer",
            ExpiresIn = AccessTokenLifetimeSeconds,
            User = MapToUserResponse(session.Staff)
        });
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Cookies[CookieName];
        if (!string.IsNullOrWhiteSpace(token))
        {
            var hash = HashToken(token);
            var session = await _context.StaffSessions
                .Include(x => x.Staff)
                .FirstOrDefaultAsync(x => x.RefreshTokenHash == hash && x.RevokedAt == null);

            if (session != null)
            {
                var now = DateTime.UtcNow;
                session.RevokedAt = now;

                var ip = ClientInfoHelper.GetClientIp(HttpContext);
                var ua = Request.Headers.UserAgent.ToString();
                var device = ClientInfoHelper.GetDevice(ua);
                var browser = ClientInfoHelper.GetBrowser(ua);

                _context.StaffAccessLogs.Add(new StaffAccessLogs
                {
                    StaffId = session.StaffId,
                    Username = session.Staff?.Username ?? string.Empty,
                    Activity = "LOGOUT",
                    Status = "SUCCESS",
                    AccessTime = now,
                    IpAddress = ip,
                    Device = device,
                    Browser = browser,
                    PagePath = null
                });

                await _context.SaveChangesAsync();
            }
        }

        ClearRefreshCookie();
        return NoContent();
    }

    // --- Private Helper Methods ---

    private string GenerateAccessToken(StaffUsers user, long sessionId)
    {
        var signingKey = _configuration["Jwt:SigningKey"]
            ?? "PTfLCKBpQigRfSfWsBe181A/AkofXGYmSRvYLdkd76AUp83JEmxbLXIf9zfGO+t4";
        var issuer = _configuration["Jwt:Issuer"] ?? "ClinicManagement.Api";
        var audience = _configuration["Jwt:Audience"] ?? "ClinicManagement.Frontend";
        var now = DateTime.UtcNow;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("sid", sessionId.ToString()),
            new Claim("role", user.Role.Code),
            new Claim(ClaimTypes.Role, user.Role.Code),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: now,
            expires: now.AddSeconds(AccessTokenLifetimeSeconds),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(48))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }

    private static string HashToken(string token)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }

    private void SetRefreshCookie(string token)
    {
        Response.Cookies.Append(CookieName, token, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = _environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Lax,
            Path = "/api/auth",
            Expires = DateTimeOffset.UtcNow.AddDays(RefreshTokenLifetimeDays),
            IsEssential = true
        });
    }

    private void ClearRefreshCookie()
    {
        Response.Cookies.Delete(CookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = _environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Lax,
            Path = "/api/auth"
        });
    }

    private static CurrentUserResponse MapToUserResponse(StaffUsers user)
    {
        return new CurrentUserResponse
        {
            Id = user.Id.ToString(),
            StaffCode = user.StaffCode,
            Username = user.Username,
            FullName = user.FullName,
            RoleCode = user.Role.Code,
            RoleName = user.Role.Name,
            Status = user.Status
        };
    }

    private static bool IsAllowedRole(string? roleCode)
    {
        return roleCode is "ADMIN" or "DOCTOR" or "RECEPTIONIST";
    }
}
