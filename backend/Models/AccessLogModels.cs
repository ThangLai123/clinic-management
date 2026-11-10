namespace ClinicManagement.Api.Models;

public class StaffAccessSummaryResponse
{
    public string Id { get; set; } = string.Empty;
    public string StaffCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string RoleCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? LastAccessTime { get; set; }
    public int TotalLogins { get; set; }
}

public class AccessOverviewStatsResponse
{
    public int TotalAccess { get; set; }
    public int TodayAccess { get; set; }
    public DateTime? MostRecentTime { get; set; }
    public string? RecentUserFullName { get; set; }
    public string? RecentUserUsername { get; set; }
}

public class AccessLogItemResponse
{
    public string Id { get; set; } = string.Empty;
    public string Activity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime AccessTime { get; set; }
    public string? IpAddress { get; set; }
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? PagePath { get; set; }
}

public class AccessLogListResponse
{
    public string? StaffId { get; set; }
    public int TotalItems { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<AccessLogItemResponse> Items { get; set; } = new();
}

public class PageAccessLogRequest
{
    public string PagePath { get; set; } = string.Empty;
}

