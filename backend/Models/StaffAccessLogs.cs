using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("staff_access_logs")]
public class StaffAccessLogs
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("staff_id")]
    public long? StaffId { get; set; }

    [Column("username")]
    [MaxLength(80)]
    public string Username { get; set; } = string.Empty;

    [Column("activity")]
    [MaxLength(20)]
    public string Activity { get; set; } = string.Empty;

    [Column("status")]
    [MaxLength(10)]
    public string Status { get; set; } = string.Empty;

    [Column("access_time")]
    public DateTime AccessTime { get; set; }

    [Column("ip_address")]
    [MaxLength(45)]
    public string? IpAddress { get; set; }

    [Column("device")]
    [MaxLength(50)]
    public string? Device { get; set; }

    [Column("browser")]
    [MaxLength(100)]
    public string? Browser { get; set; }

    [Column("page_path")]
    [MaxLength(300)]
    public string? PagePath { get; set; }

    public StaffUsers? Staff { get; set; }
}

