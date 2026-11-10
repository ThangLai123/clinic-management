using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("clinical_service_indications")]
public class ClinicalServiceIndications
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("service_id")]
    public long ServiceId { get; set; }

    [Column("content")]
    [MaxLength(300)]
    public string Content { get; set; } = string.Empty;

    [Column("display_order")]
    public int DisplayOrder { get; set; }

    public ClinicalServices Service { get; set; } = null!;
}

