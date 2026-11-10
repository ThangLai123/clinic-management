using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("patients")]
public class Patients
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(30)]
    [Column("patient_code")]
    public string PatientCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("birth_date")]
    public DateOnly? BirthDate { get; set; }

    [Required]
    [MaxLength(12)]
    [Column("gender")]
    public string Gender { get; set; } = string.Empty;

    [MaxLength(20)]
    [Column("phone")]
    public string? Phone { get; set; }

    [MaxLength(500)]
    [Column("address")]
    public string? Address { get; set; }

    [MaxLength(120)]
    [Column("occupation")]
    public string? Occupation { get; set; }

    [MaxLength(50)]
    [Column("insurance_number")]
    public string? InsuranceNumber { get; set; }

    [Column("allergy_notes")]
    public string? AllergyNotes { get; set; }

    [Column("medical_history_notes")]
    public string? MedicalHistoryNotes { get; set; }

    [MaxLength(150)]
    [Column("emergency_contact_name")]
    public string? EmergencyContactName { get; set; }

    [MaxLength(20)]
    [Column("emergency_contact_phone")]
    public string? EmergencyContactPhone { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    public ICollection<Appointments> Appointments { get; set; } = new List<Appointments>();
}

