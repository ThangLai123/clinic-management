using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("clinical_services")]
public class ClinicalServices
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("service_code")]
    [MaxLength(30)]
    public string ServiceCode { get; set; } = string.Empty;

    [Column("category_id")]
    public long CategoryId { get; set; }

    [Column("service_name")]
    [MaxLength(200)]
    public string ServiceName { get; set; } = string.Empty;

    [Column("description")]
    [MaxLength(500)]
    public string? Description { get; set; }

    [Column("price", TypeName = "decimal(15,2)")]
    public decimal Price { get; set; }

    [Column("duration_min")]
    public int? DurationMin { get; set; }

    [Column("duration_max")]
    public int? DurationMax { get; set; }

    [Column("display_order")]
    public int DisplayOrder { get; set; }

    [Column("status")]
    [MaxLength(10)]
    public string Status { get; set; } = "ACTIVE";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    public ServiceCategories Category { get; set; } = null!;
    public ICollection<ClinicalServiceIndications> Indications { get; set; } = new List<ClinicalServiceIndications>();
}

