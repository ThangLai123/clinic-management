namespace ClinicManagement.Api.Models;

public class ServiceCategoryResponse
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class ClinicalServiceItemResponse
{
    public string Id { get; set; } = string.Empty;
    public string ServiceCode { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public string CategoryCode { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int? DurationMin { get; set; }
    public int? DurationMax { get; set; }
    public List<string> Indications { get; set; } = new();
}

public class ClinicalServiceListResponse
{
    public int TotalItems { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<ClinicalServiceItemResponse> Items { get; set; } = new();
}

