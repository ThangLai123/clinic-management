using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "DOCTOR")]
public class DoctorController : ControllerBase
{
    private readonly DataContext _context;

    public DoctorController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            role = "Doctor",
            timestamp = DateTime.UtcNow
        });
    }
}
