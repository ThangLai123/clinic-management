using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/services")]
[AllowAnonymous]
public class ServicesController : ControllerBase
{
    private readonly DataContext _context;

    public ServicesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.ServiceCategories
            .AsNoTracking()
            .Where(c => c.Status == "ACTIVE")
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.Id)
            .Select(c => new ServiceCategoryResponse
            {
                Id = c.Id.ToString(),
                Code = c.Code,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet]
    public async Task<IActionResult> GetServices(
        [FromQuery] string? categoryCode,
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 12;

        var query = _context.ClinicalServices
            .AsNoTracking()
            .Include(s => s.Category)
            .Where(s => s.Status == "ACTIVE" && s.Category.Status == "ACTIVE");

        if (!string.IsNullOrWhiteSpace(categoryCode) && !categoryCode.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            var catCode = categoryCode.Trim();
            query = query.Where(s => s.Category.Code == catCode);
        }

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var kw = keyword.Trim();
            if (kw.Length > 100) kw = kw[..100];

            query = query.Where(s =>
                s.ServiceName.Contains(kw) ||
                (s.Description != null && s.Description.Contains(kw)) ||
                s.Indications.Any(i => i.Content.Contains(kw)));
        }

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderBy(s => s.DisplayOrder)
            .ThenBy(s => s.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new ClinicalServiceItemResponse
            {
                Id = s.Id.ToString(),
                ServiceCode = s.ServiceCode,
                ServiceName = s.ServiceName,
                CategoryCode = s.Category.Code,
                CategoryName = s.Category.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMin = s.DurationMin,
                DurationMax = s.DurationMax,
                Indications = s.Indications
                    .OrderBy(i => i.DisplayOrder)
                    .ThenBy(i => i.Id)
                    .Select(i => i.Content)
                    .ToList()
            })
            .ToListAsync();

        return Ok(new ClinicalServiceListResponse
        {
            TotalItems = totalItems,
            Page = page,
            PageSize = pageSize,
            Items = items
        });
    }

    [HttpGet("{serviceCode}")]
    public async Task<IActionResult> GetServiceByCode([FromRoute] string serviceCode)
    {
        var code = serviceCode?.Trim();
        if (string.IsNullOrWhiteSpace(code))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Mã dịch vụ không được để trống."
            });
        }

        var service = await _context.ClinicalServices
            .AsNoTracking()
            .Include(s => s.Category)
            .Where(s => s.ServiceCode == code && s.Status == "ACTIVE" && s.Category.Status == "ACTIVE")
            .Select(s => new ClinicalServiceItemResponse
            {
                Id = s.Id.ToString(),
                ServiceCode = s.ServiceCode,
                ServiceName = s.ServiceName,
                CategoryCode = s.Category.Code,
                CategoryName = s.Category.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMin = s.DurationMin,
                DurationMax = s.DurationMax,
                Indications = s.Indications
                    .OrderBy(i => i.DisplayOrder)
                    .ThenBy(i => i.Id)
                    .Select(i => i.Content)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (service == null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Không tìm thấy dịch vụ",
                Detail = $"Không tìm thấy dịch vụ y tế với mã '{code}' hoặc dịch vụ chưa được công khai."
            });
        }

        return Ok(service);
    }
}

