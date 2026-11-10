using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ClinicManagement.Api.Helpers;
using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/access-logs")]
[Authorize]
public class AccessLogsController : ControllerBase
{
    private readonly DataContext _context;

    public AccessLogsController(DataContext context)
    {
        _context = context;
    }

    [HttpPost("page")]
    public async Task<IActionResult> LogPageAccess([FromBody] PageAccessLogRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.PagePath))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Đường dẫn trang không được để trống."
            });
        }

        var subClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!long.TryParse(subClaim, out var staffId))
        {
            return Unauthorized();
        }

        var user = await _context.StaffUsers
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == staffId && x.Status == "ACTIVE");

        if (user == null)
        {
            return Unauthorized();
        }

        // Loại bỏ query string và hash
        var cleanPath = request.PagePath.Split('?')[0].Split('#')[0].Trim();
        if (string.IsNullOrEmpty(cleanPath) || !cleanPath.StartsWith('/'))
        {
            cleanPath = "/" + cleanPath;
        }

        // Kiểm tra quyền nghiệp vụ theo vai trò
        var roleCode = user.Role.Code;
        var isAllowed = false;

        if (roleCode == "DOCTOR" && (cleanPath == "/doctor" || cleanPath.StartsWith("/doctor/")))
        {
            isAllowed = true;
        }
        else if (roleCode == "RECEPTIONIST" && (cleanPath == "/receptionist" || cleanPath.StartsWith("/receptionist/")))
        {
            isAllowed = true;
        }

        if (!isAllowed)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Không có quyền truy cập",
                Detail = "Đường dẫn không thuộc phạm vi nghiệp vụ được phân quyền."
            });
        }

        var now = DateTime.UtcNow;
        var ip = ClientInfoHelper.GetClientIp(HttpContext);
        var ua = Request.Headers.UserAgent.ToString();
        var device = ClientInfoHelper.GetDevice(ua);
        var browser = ClientInfoHelper.GetBrowser(ua);

        var log = new StaffAccessLogs
        {
            StaffId = user.Id,
            Username = user.Username,
            Activity = "PAGE_ACCESS",
            Status = "SUCCESS",
            AccessTime = now,
            IpAddress = ip,
            Device = device,
            Browser = browser,
            PagePath = cleanPath.Length > 300 ? cleanPath[..300] : cleanPath
        };

        _context.StaffAccessLogs.Add(log);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

