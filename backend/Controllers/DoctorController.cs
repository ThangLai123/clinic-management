using Microsoft.AspNetCore.Mvc;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DoctorController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            role = "Doctor",
            area = (string?)null,
            timestamp = DateTime.UtcNow
        });
    }
}

