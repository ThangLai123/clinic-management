using Microsoft.AspNetCore.Mvc;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Check()
    {
        return Ok(new
        {
            status = "Healthy",
            role = "Patient/Public",
            area = (string?)null,
            timestamp = DateTime.UtcNow
        });
    }
}

