using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("appointment_status_history")]
public class AppointmentStatusHistory
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("appointment_id")]
    public long AppointmentId { get; set; }

    [ForeignKey(nameof(AppointmentId))]
    public Appointments Appointment { get; set; } = null!;

    [MaxLength(20)]
    [Column("old_status")]
    public string? OldStatus { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("new_status")]
    public string NewStatus { get; set; } = "PENDING";

    [Column("changed_by_staff_id")]
    public long? ChangedByStaffId { get; set; }

    [ForeignKey(nameof(ChangedByStaffId))]
    public StaffUsers? ChangedByStaff { get; set; }

    [MaxLength(500)]
    [Column("reason")]
    public string? Reason { get; set; }

    [Column("changed_at")]
    public DateTime ChangedAt { get; set; }
}

