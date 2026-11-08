using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Api.Models;

public class CreateStaffRequest
{
    [Required(ErrorMessage = "Họ và tên là bắt buộc.")]
    [MaxLength(150, ErrorMessage = "Họ và tên không được vượt quá 150 ký tự.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tên đăng nhập là bắt buộc.")]
    [MaxLength(80, ErrorMessage = "Tên đăng nhập không được vượt quá 80 ký tự.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
    [MinLength(12, ErrorMessage = "Mật khẩu phải có tối thiểu 12 ký tự.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vai trò là bắt buộc.")]
    public string RoleCode { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
    [MaxLength(254, ErrorMessage = "Email không được vượt quá 254 ký tự.")]
    public string? Email { get; set; }

    [MaxLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự.")]
    public string? Phone { get; set; }

    [MaxLength(80, ErrorMessage = "Giấy phép hành nghề không được vượt quá 80 ký tự.")]
    public string? LicenseNumber { get; set; }
}

public class StaffResponse
{
    public string Id { get; set; } = string.Empty;
    public string StaffCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string RoleCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LicenseNumber { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class UpdateStaffRequest
{
    [Required(ErrorMessage = "Họ và tên là bắt buộc.")]
    [MaxLength(150, ErrorMessage = "Họ và tên không được vượt quá 150 ký tự.")]
    public string FullName { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
    [MaxLength(254, ErrorMessage = "Email không được vượt quá 254 ký tự.")]
    public string? Email { get; set; }

    [MaxLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự.")]
    public string? Phone { get; set; }

    [Required(ErrorMessage = "Vai trò là bắt buộc.")]
    public string RoleCode { get; set; } = string.Empty;

    [MaxLength(80, ErrorMessage = "Giấy phép hành nghề không được vượt quá 80 ký tự.")]
    public string? LicenseNumber { get; set; }
}

public class UpdateStaffStatusRequest
{
    [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
    public string Status { get; set; } = string.Empty;
}

public class StaffStatusResponse
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

