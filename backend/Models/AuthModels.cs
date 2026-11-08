using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Api.Models;

public class LoginRequest
{
    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập.")]
    [MaxLength(80)]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vui lòng nhập mật khẩu.")]
    public string Password { get; set; } = string.Empty;
}

public class CurrentUserResponse
{
    public string Id { get; set; } = string.Empty;
    public string StaffCode { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string RoleCode { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; }
    public CurrentUserResponse User { get; set; } = new();
}

