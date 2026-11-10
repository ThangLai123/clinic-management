using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("appointments")]
public class Appointments
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(30)]
    [Column("appointment_code")]
    public string AppointmentCode { get; set; } = string.Empty;

    [Column("patient_id")]
    public long? PatientId { get; set; }

    [ForeignKey(nameof(PatientId))]
    public Patients? Patient { get; set; }

    [Column("service_id")]
    public long? ServiceId { get; set; }

    [ForeignKey(nameof(ServiceId))]
    public ClinicalServices? Service { get; set; }

    [Required]
    [MaxLength(150)]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [Column("birth_date")]
    public DateOnly? BirthDate { get; set; }

    [Required]
    [MaxLength(12)]
    [Column("gender")]
    public string Gender { get; set; } = string.Empty;

    [Column("appointment_date")]
    public DateOnly AppointmentDate { get; set; }

    [Column("appointment_time")]
    public TimeOnly AppointmentTime { get; set; }

    [Column("symptoms")]
    public string? Symptoms { get; set; }

    [MaxLength(500)]
    [Column("notes")]
    public string? Notes { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("source")]
    public string Source { get; set; } = "ONLINE";

    [Required]
    [MaxLength(20)]
    [Column("status")]
    public string Status { get; set; } = "PENDING";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    public ICollection<AppointmentStatusHistory> StatusHistory { get; set; } = new List<AppointmentStatusHistory>();
}

