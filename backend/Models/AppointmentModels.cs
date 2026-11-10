using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.Api.Models;

public class CreateAppointmentRequest
{
    [Required(ErrorMessage = "Họ và tên bệnh nhân không được để trống.")]
    [MaxLength(150, ErrorMessage = "Họ và tên tối đa 150 ký tự.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Số điện thoại không được để trống.")]
    [MaxLength(20, ErrorMessage = "Số điện thoại tối đa 20 ký tự.")]
    public string Phone { get; set; } = string.Empty;

    public string? BirthDate { get; set; }

    public string? Gender { get; set; } = "MALE";

    [Required(ErrorMessage = "Ngày hẹn khám không được để trống.")]
    public string AppointmentDate { get; set; } = string.Empty;

    [Required(ErrorMessage = "Khung giờ khám không được để trống.")]
    public string AppointmentTime { get; set; } = string.Empty;

    public string? ServiceCode { get; set; }

    public List<string>? Symptoms { get; set; }

    public string? SymptomDescription { get; set; }

    [MaxLength(500, ErrorMessage = "Ghi chú tối đa 500 ký tự.")]
    public string? Notes { get; set; }
}

public class AppointmentResponse
{
    public string AppointmentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AppointmentDate { get; set; } = string.Empty;
    public string AppointmentTime { get; set; } = string.Empty;
    public string? ServiceCode { get; set; }
    public string? ServiceName { get; set; }
    public string Status { get; set; } = "PENDING";
    public string Message { get; set; } = "Yêu cầu đặt lịch đã được ghi nhận và đang chờ xác nhận.";
}

public class TimeSlotResponse
{
    public string Slot { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
}

