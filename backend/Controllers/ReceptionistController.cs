using Microsoft.AspNetCore.Mvc;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ReceptionistController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            role = "Receptionist",
            area = (string?)null,
            timestamp = DateTime.UtcNow
        });
    }
}

