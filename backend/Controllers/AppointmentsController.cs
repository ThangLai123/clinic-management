using System.Text.RegularExpressions;
using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicManagement.Api.Controllers;

[ApiController]
[Route("api/appointments")]
[AllowAnonymous]
public class AppointmentsController : ControllerBase
{
    private readonly DataContext _context;
    private readonly ILogger<AppointmentsController> _logger;

    private static readonly (string Slot, string Start, string End)[] MasterTimeSlots = new[]
    {
        ("08:00 - 08:30", "08:00", "08:30"),
        ("08:30 - 09:00", "08:30", "09:00"),
        ("09:00 - 09:30", "09:00", "09:30"),
        ("09:30 - 10:00", "09:30", "10:00"),
        ("10:00 - 10:30", "10:00", "10:30"),
        ("10:30 - 11:00", "10:30", "11:00"),
        ("11:00 - 11:30", "11:00", "11:30"),
        ("14:00 - 14:30", "14:00", "14:30"),
        ("14:30 - 15:00", "14:30", "15:00"),
        ("15:00 - 15:30", "15:00", "15:30"),
        ("15:30 - 16:00", "15:30", "16:00"),
        ("16:00 - 16:30", "16:00", "16:30"),
        ("16:30 - 17:00", "16:30", "17:00"),
        ("17:30 - 18:00", "17:30", "18:00"),
        ("18:00 - 18:30", "18:00", "18:30"),
        ("18:30 - 19:00", "18:30", "19:00"),
        ("19:00 - 19:30", "19:00", "19:30"),
    };

    public AppointmentsController(DataContext context, ILogger<AppointmentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private static DateTime GetVietnamNow()
    {
        try
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
        }
        catch
        {
            return DateTime.UtcNow.AddHours(7);
        }
    }

    [HttpGet("time-slots")]
    public IActionResult GetTimeSlots([FromQuery] string? date)
    {
        if (string.IsNullOrWhiteSpace(date) || !DateOnly.TryParse(date.Trim(), out var parsedDate))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Vui lòng cung cấp ngày hợp lệ theo định dạng YYYY-MM-DD."
            });
        }

        var nowVn = GetVietnamNow();
        var todayVn = DateOnly.FromDateTime(nowVn);

        if (parsedDate < todayVn)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Ngày không hợp lệ",
                Detail = "Không thể tra cứu hoặc đặt lịch vào ngày trong quá khứ."
            });
        }

        var currentTimeVn = TimeOnly.FromDateTime(nowVn);

        var availableSlots = MasterTimeSlots
            .Where(slot =>
            {
                if (parsedDate > todayVn) return true;
                if (TimeOnly.TryParse(slot.Start, out var slotStartTime))
                {
                    return slotStartTime > currentTimeVn;
                }
                return true;
            })
            .Select(slot => slot.Slot)
            .ToList();

        return Ok(availableSlots);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
    {
        try
        {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Dữ liệu không hợp lệ",
                Detail = "Vui lòng kiểm tra lại các thông tin bắt buộc."
            });
        }

        // 1. Validate họ tên
        var fullName = request.FullName?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(fullName) || fullName.Length < 2)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Họ tên không hợp lệ",
                Detail = "Vui lòng nhập đầy đủ họ và tên người khám."
            });
        }

        // 2. Validate số điện thoại VN (10 chữ số)
        var phone = Regex.Replace(request.Phone?.Trim() ?? string.Empty, @"\s+", "");
        if (!Regex.IsMatch(phone, @"^(0[35789])[0-9]{8}$"))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Số điện thoại không hợp lệ",
                Detail = "Số điện thoại phải gồm 10 chữ số chuẩn của các nhà mạng Việt Nam."
            });
        }

        var nowVn = GetVietnamNow();
        var todayVn = DateOnly.FromDateTime(nowVn);
        var currentTimeVn = TimeOnly.FromDateTime(nowVn);

        // 3. Validate ngày sinh nếu có
        DateOnly? birthDate = null;
        if (!string.IsNullOrWhiteSpace(request.BirthDate))
        {
            if (DateOnly.TryParse(request.BirthDate.Trim(), out var parsedBirth))
            {
                if (parsedBirth > todayVn)
                {
                    return BadRequest(new ProblemDetails
                    {
                        Status = StatusCodes.Status400BadRequest,
                        Title = "Ngày sinh không hợp lệ",
                        Detail = "Ngày sinh không thể lớn hơn ngày hiện tại."
                    });
                }
                birthDate = parsedBirth;
            }
        }

        // 4. Validate giới tính
        var gender = request.Gender?.Trim().ToUpperInvariant() ?? "MALE";
        if (gender is not ("MALE" or "FEMALE" or "OTHER" or "UNSPECIFIED"))
        {
            gender = "MALE";
        }

        // 5. Validate ngày hẹn khám
        if (string.IsNullOrWhiteSpace(request.AppointmentDate) || !DateOnly.TryParse(request.AppointmentDate.Trim(), out var appointmentDate))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Ngày khám không hợp lệ",
                Detail = "Vui lòng chọn ngày khám hợp lệ (định dạng YYYY-MM-DD)."
            });
        }

        if (appointmentDate < todayVn)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Ngày khám không hợp lệ",
                Detail = "Không thể đặt lịch vào ngày trong quá khứ."
            });
        }

        // 6. Validate giờ hẹn khám
        var rawTime = request.AppointmentTime?.Trim() ?? string.Empty;
        if (rawTime.Contains(" - "))
        {
            rawTime = rawTime.Split(" - ")[0].Trim();
        }

        if (!TimeOnly.TryParse(rawTime, out var appointmentTime))
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Khung giờ không hợp lệ",
                Detail = "Vui lòng chọn khung giờ tiếp nhận hợp lệ."
            });
        }

        if (appointmentDate == todayVn && appointmentTime <= currentTimeVn)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Khung giờ không hợp lệ",
                Detail = "Khung giờ bạn chọn trong ngày hôm nay đã trôi qua. Vui lòng chọn khung giờ khác."
            });
        }

        // 7. Kiểm tra dịch vụ y tế nếu có truyền serviceCode
        ClinicalServices? selectedService = null;
        if (!string.IsNullOrWhiteSpace(request.ServiceCode))
        {
            var code = request.ServiceCode.Trim();
            selectedService = await _context.ClinicalServices
                .AsNoTracking()
                .Include(s => s.Category)
                .FirstOrDefaultAsync(s => s.ServiceCode == code && s.Status == "ACTIVE" && s.Category.Status == "ACTIVE");

            if (selectedService == null)
            {
                return NotFound(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Dịch vụ không tồn tại",
                    Detail = $"Dịch vụ y tế với mã '{code}' không tồn tại hoặc đã ngừng tiếp nhận."
                });
            }
        }

        // 8. Chống đặt lịch trùng lặp (cùng người bệnh, cùng số điện thoại, cùng ngày giờ khám và đang ở trạng thái PENDING/CONFIRMED)
        var isDuplicate = await _context.Appointments
            .AsNoTracking()
            .AnyAsync(a =>
                a.FullName == fullName &&
                a.Phone == phone &&
                a.AppointmentDate == appointmentDate &&
                a.AppointmentTime == appointmentTime &&
                (a.Status == "PENDING" || a.Status == "CONFIRMED"));

        if (isDuplicate)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Yêu cầu đặt lịch bị trùng",
                Detail = "Bạn đã có lịch hẹn vào ngày và khung giờ này đang chờ xử lý hoặc đã được xác nhận. Vui lòng kiểm tra lại hoặc liên hệ hotline phòng khám."
            });
        }

        // 9. Sinh mã lịch hẹn duy nhất: LH{yyyyMMdd}-{seq:D3}
        var datePrefix = $"LH{nowVn:yyyyMMdd}-";
        var countToday = await _context.Appointments
            .CountAsync(a => a.AppointmentCode.StartsWith(datePrefix));

        var nextNum = countToday + 1;
        var appointmentCode = $"{datePrefix}{nextNum:D3}";
        while (await _context.Appointments.AnyAsync(a => a.AppointmentCode == appointmentCode))
        {
            nextNum++;
            appointmentCode = $"{datePrefix}{nextNum:D3}";
        }

        // 10. Xử lý triệu chứng và ghi chú
        var symptomsList = request.Symptoms?.Where(s => !string.IsNullOrWhiteSpace(s)).Select(s => s.Trim()).ToList() ?? new List<string>();
        string? combinedSymptoms = null;
        if (symptomsList.Count > 0)
        {
            combinedSymptoms = string.Join(", ", symptomsList);
            if (!string.IsNullOrWhiteSpace(request.SymptomDescription))
            {
                combinedSymptoms += " - " + request.SymptomDescription.Trim();
            }
        }
        else if (!string.IsNullOrWhiteSpace(request.SymptomDescription))
        {
            combinedSymptoms = request.SymptomDescription.Trim();
        }

        var notes = !string.IsNullOrWhiteSpace(request.Notes)
            ? (request.Notes.Trim().Length > 500 ? request.Notes.Trim()[..500] : request.Notes.Trim())
            : null;

        var appointment = new Appointments
        {
            AppointmentCode = appointmentCode,
            PatientId = null,
            ServiceId = selectedService?.Id,
            FullName = fullName,
            Phone = phone,
            BirthDate = birthDate,
            Gender = gender,
            AppointmentDate = appointmentDate,
            AppointmentTime = appointmentTime,
            Symptoms = combinedSymptoms,
            Notes = notes,
            Source = "ONLINE",
            Status = "PENDING",
            CreatedAt = nowVn,
            UpdatedAt = nowVn
        };

        // 11. Lưu vào CSDL trong cùng 1 Transaction
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            var history = new AppointmentStatusHistory
            {
                AppointmentId = appointment.Id,
                OldStatus = null,
                NewStatus = "PENDING",
                ChangedByStaffId = null,
                Reason = "Đặt lịch trực tuyến",
                ChangedAt = nowVn
            };

            _context.AppointmentStatusHistory.Add(history);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "BE-05: Không thể lưu lịch hẹn và lịch sử trạng thái.");
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Lỗi hệ thống",
                Detail = "Đã xảy ra sự cố khi lưu phiếu đặt hẹn. Vui lòng thử lại sau."
            });
        }

        return StatusCode(StatusCodes.Status201Created, new AppointmentResponse
        {
            AppointmentCode = appointment.AppointmentCode,
            FullName = appointment.FullName,
            Phone = appointment.Phone,
            AppointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
            AppointmentTime = appointment.AppointmentTime.ToString("HH:mm"),
            ServiceCode = selectedService?.ServiceCode,
            ServiceName = selectedService?.ServiceName ?? "Khám tổng quát Tai Mũi Họng",
            Status = appointment.Status,
            Message = "Yêu cầu đặt lịch đã được ghi nhận và đang chờ xác nhận."
        });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "BE-05: Lỗi không mong đợi khi xử lý yêu cầu đặt lịch.");
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Không thể đặt lịch",
                Detail = "Hệ thống chưa thể tiếp nhận lịch hẹn. Vui lòng thử lại sau."
            });
        }
    }
}

