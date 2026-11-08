using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("staff_sessions")]
public class StaffSessions
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("staff_id")]
    public long StaffId { get; set; }

    [Column("refresh_token_hash")]
    [MaxLength(64)]
    public string RefreshTokenHash { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("revoked_at")]
    public DateTime? RevokedAt { get; set; }

    public StaffUsers Staff { get; set; } = null!;
}

