using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly DataContext _context;
    private readonly IPasswordHasher<StaffUsers> _passwordHasher;

    public AdminController(DataContext context, IPasswordHasher<StaffUsers> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            role = "Admin",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("staff")]
    public async Task<IActionResult> GetStaffList()
    {
        var users = await _context.StaffUsers
            .AsNoTracking()
            .Include(x => x.Role)
            .Where(x => x.Role.Code == "DOCTOR" || x.Role.Code == "RECEPTIONIST")
            .OrderBy(x => x.Id)
            .Select(x => new StaffResponse
            {
                Id = x.Id.ToString(),
                StaffCode = x.StaffCode,
                FullName = x.FullName,
                Username = x.Username,
                RoleCode = x.Role.Code,
                Status = x.Status,
                Email = x.Email,
                Phone = x.Phone,
                LicenseNumber = x.LicenseNumber,
                LastLoginAt = x.LastLoginAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("staff")]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffRequest request)
    {
        // 1. Validate ModelState
        if (!ModelState.IsValid)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))
            });
        }

        var fullName = request.FullName?.Trim() ?? string.Empty;
        var username = request.Username?.Trim() ?? string.Empty;
        var password = request.Password;
        var roleCode = request.RoleCode?.Trim().ToUpperInvariant() ?? string.Empty;
        var email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        var licenseNumber = string.IsNullOrWhiteSpace(request.LicenseNumber) ? null : request.LicenseNumber.Trim();

        if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Họ tên, tên đăng nhập và mật khẩu là bắt buộc."
            });
        }

        if (password.Length < 12)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Mật khẩu không hợp lệ",
                Detail = "Mật khẩu phải có tối thiểu 12 ký tự."
            });
        }

        // 2. Validate Role: only DOCTOR or RECEPTIONIST
        if (roleCode != "DOCTOR" && roleCode != "RECEPTIONIST")
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Vai trò không hợp lệ",
                Detail = "Chỉ được phép tạo tài khoản cho Bác sĩ (DOCTOR) hoặc Lễ tân (RECEPTIONIST)."
            });
        }

        // 3. Check username exists
        var usernameExists = await _context.StaffUsers.AnyAsync(x => x.Username == username);
        if (usernameExists)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Tên đăng nhập đã tồn tại",
                Detail = $"Tên đăng nhập '{username}' đã được sử dụng trong hệ thống."
            });
        }

        // 4. Query Role from DB
        var role = await _context.Roles.FirstOrDefaultAsync(x => x.Code == roleCode);
        if (role == null)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Vai trò không tồn tại",
                Detail = $"Không tìm thấy vai trò '{roleCode}' trong cơ sở dữ liệu."
            });
        }

        // 5. Generate unique staff_code
        var count = await _context.StaffUsers.CountAsync();
        var nextNum = count + 1;
        var staffCode = $"NV{nextNum:D6}";
        while (await _context.StaffUsers.AnyAsync(x => x.StaffCode == staffCode))
        {
            nextNum++;
            staffCode = $"NV{nextNum:D6}";
        }

        // 6. Create Entity
        var now = DateTime.UtcNow;
        var staffUser = new StaffUsers
        {
            StaffCode = staffCode,
            Username = username,
            FullName = fullName,
            Email = email,
            Phone = phone,
            RoleId = role.Id,
            Role = role,
            LicenseNumber = roleCode == "DOCTOR" ? licenseNumber : null,
            Status = "ACTIVE",
            CreatedAt = now,
            UpdatedAt = now
        };

        // 7. Hash password
        staffUser.PasswordHash = _passwordHasher.HashPassword(staffUser, password);

        // 8. Add and Save
        try
        {
            _context.StaffUsers.Add(staffUser);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Xung đột dữ liệu",
                Detail = "Tài khoản hoặc mã nhân viên bị trùng lặp. Vui lòng thử lại."
            });
        }

        // 9. Return 201 Created
        var response = new StaffResponse
        {
            Id = staffUser.Id.ToString(),
            StaffCode = staffUser.StaffCode,
            FullName = staffUser.FullName,
            Username = staffUser.Username,
            RoleCode = role.Code,
            Status = staffUser.Status,
            Email = staffUser.Email,
            Phone = staffUser.Phone,
            LicenseNumber = staffUser.LicenseNumber,
            LastLoginAt = staffUser.LastLoginAt
        };

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPut("staff/{id}")]
    public async Task<IActionResult> UpdateStaff([FromRoute] string id, [FromBody] UpdateStaffRequest request)
    {
        // 1. Validate ModelState
        if (!ModelState.IsValid)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))
            });
        }

        if (!long.TryParse(id, out var staffId))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "ID không hợp lệ",
                Detail = "Mã định danh nhân viên không đúng định dạng."
            });
        }

        var fullName = request.FullName?.Trim() ?? string.Empty;
        var roleCode = request.RoleCode?.Trim().ToUpperInvariant() ?? string.Empty;
        var email = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
        var licenseNumber = string.IsNullOrWhiteSpace(request.LicenseNumber) ? null : request.LicenseNumber.Trim();

        if (string.IsNullOrWhiteSpace(fullName))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Họ và tên nhân viên là bắt buộc."
            });
        }

        // Chỉ chấp nhận DOCTOR hoặc RECEPTIONIST
        if (roleCode != "DOCTOR" && roleCode != "RECEPTIONIST")
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Vai trò không hợp lệ",
                Detail = "Chỉ được phép gán vai trò Bác sĩ (DOCTOR) hoặc Lễ tân (RECEPTIONIST)."
            });
        }

        // 2. Tìm nhân viên theo ID
        var user = await _context.StaffUsers
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == staffId);

        if (user == null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Không tìm thấy nhân viên",
                Detail = $"Không tìm thấy tài khoản nhân viên với ID = {staffId}."
            });
        }

        // 3. Nếu là tài khoản ADMIN -> 403 Forbidden
        if (user.Role.Code == "ADMIN")
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Không có quyền thao tác",
                Detail = "Không được phép chỉnh sửa tài khoản Quản trị viên hệ thống."
            });
        }

        // 4. Lấy vai trò mới từ database
        var newRole = await _context.Roles.FirstOrDefaultAsync(x => x.Code == roleCode);
        if (newRole == null)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Vai trò không tồn tại",
                Detail = $"Không tìm thấy vai trò '{roleCode}' trong cơ sở dữ liệu."
            });
        }

        var roleChanged = user.RoleId != newRole.Id;
        var now = DateTime.UtcNow;

        user.FullName = fullName;
        user.Email = email;
        user.Phone = phone;
        user.RoleId = newRole.Id;
        user.Role = newRole;
        user.LicenseNumber = roleCode == "DOCTOR" ? licenseNumber : null;
        user.UpdatedAt = now;

        // 5. Nếu thay đổi vai trò, thu hồi toàn bộ phiên đăng nhập còn hiệu lực trong staff_sessions
        if (roleChanged)
        {
            var activeSessions = await _context.StaffSessions
                .Where(s => s.StaffId == user.Id && s.RevokedAt == null)
                .ToListAsync();

            foreach (var session in activeSessions)
            {
                session.RevokedAt = now;
            }
        }

        await _context.SaveChangesAsync();

        var response = new StaffResponse
        {
            Id = user.Id.ToString(),
            StaffCode = user.StaffCode,
            FullName = user.FullName,
            Username = user.Username,
            RoleCode = user.Role.Code,
            Status = user.Status,
            Email = user.Email,
            Phone = user.Phone,
            LicenseNumber = user.LicenseNumber,
            LastLoginAt = user.LastLoginAt
        };

        return Ok(response);
    }

    [HttpPatch("staff/{id}/status")]
    public async Task<IActionResult> UpdateStaffStatus([FromRoute] string id, [FromBody] UpdateStaffStatusRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))
            });
        }

        if (!long.TryParse(id, out var staffId))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "ID không hợp lệ",
                Detail = "Mã định danh nhân viên không đúng định dạng."
            });
        }

        var status = request.Status?.Trim().ToUpperInvariant() ?? string.Empty;
        if (status != "ACTIVE" && status != "LOCKED")
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Trạng thái không hợp lệ",
                Detail = "Chỉ cho phép chuyển trạng thái thành ACTIVE hoặc LOCKED."
            });
        }

        var user = await _context.StaffUsers
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == staffId);

        if (user == null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Không tìm thấy nhân viên",
                Detail = $"Không tìm thấy tài khoản nhân viên với ID = {staffId}."
            });
        }

        // Không cho phép đổi trạng thái ADMIN
        if (user.Role.Code == "ADMIN")
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Không có quyền thao tác",
                Detail = "Không được phép thay đổi trạng thái tài khoản Quản trị viên hệ thống."
            });
        }

        var now = DateTime.UtcNow;
        user.Status = status;
        user.UpdatedAt = now;

        // Khi khóa tài khoản, thu hồi tất cả phiên đang hoạt động trong staff_sessions
        if (status == "LOCKED")
        {
            var activeSessions = await _context.StaffSessions
                .Where(s => s.StaffId == user.Id && s.RevokedAt == null)
                .ToListAsync();

            foreach (var session in activeSessions)
            {
                session.RevokedAt = now;
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new StaffStatusResponse
        {
            Id = user.Id.ToString(),
            Username = user.Username,
            Status = user.Status
        });
    }
}
