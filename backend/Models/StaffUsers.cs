using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("staff_users")]
public class StaffUsers
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("staff_code")]
    [MaxLength(30)]
    public string StaffCode { get; set; } = string.Empty;

    [Column("username")]
    [MaxLength(80)]
    public string Username { get; set; } = string.Empty;

    [Column("password_hash")]
    [MaxLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("full_name")]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Column("email")]
    [MaxLength(254)]
    public string? Email { get; set; }

    [Column("phone")]
    [MaxLength(20)]
    public string? Phone { get; set; }

    [Column("role_id")]
    public long RoleId { get; set; }

    [Column("license_number")]
    [MaxLength(80)]
    public string? LicenseNumber { get; set; }

    [Column("status")]
    [MaxLength(12)]
    public string Status { get; set; } = "ACTIVE";

    [Column("last_login_at")]
    public DateTime? LastLoginAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    public Roles Role { get; set; } = null!;
    public ICollection<StaffSessions> Sessions { get; set; } = new List<StaffSessions>();
}

