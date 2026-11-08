using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "RECEPTIONIST")]
public class ReceptionistController : ControllerBase
{
    private readonly DataContext _context;

    public ReceptionistController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            role = "Receptionist",
            timestamp = DateTime.UtcNow
        });
    }
}
