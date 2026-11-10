using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicManagement.Api.Models;

[Table("service_categories")]
public class ServiceCategories
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("code")]
    [MaxLength(30)]
    public string Code { get; set; } = string.Empty;

    [Column("name")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Column("display_order")]
    public int DisplayOrder { get; set; }

    [Column("status")]
    [MaxLength(10)]
    public string Status { get; set; } = "ACTIVE";

    public ICollection<ClinicalServices> Services { get; set; } = new List<ClinicalServices>();
}

