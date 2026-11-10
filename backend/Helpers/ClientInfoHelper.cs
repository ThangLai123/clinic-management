namespace ClinicManagement.Api.Helpers;

public static class ClientInfoHelper
{
    public static string GetClientIp(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            var firstIp = forwardedFor.FirstOrDefault()?.Split(',')[0].Trim();
            if (!string.IsNullOrWhiteSpace(firstIp))
            {
                return firstIp;
            }
        }

        var remoteIp = context.Connection.RemoteIpAddress?.ToString();
        if (remoteIp == "::1")
        {
            return "127.0.0.1";
        }

        return !string.IsNullOrWhiteSpace(remoteIp) ? remoteIp : "127.0.0.1";
    }

    public static string GetDevice(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return "Desktop";
        }

        var ua = userAgent.ToLowerInvariant();
        if (ua.Contains("ipad") || ua.Contains("tablet"))
        {
            return "Tablet";
        }

        if (ua.Contains("mobile") || ua.Contains("android") || ua.Contains("iphone"))
        {
            return "Mobile";
        }

        return "Desktop";
    }

    public static string GetBrowser(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return "Chrome";
        }

        var ua = userAgent.ToLowerInvariant();
        if (ua.Contains("edg/"))
        {
            return "Edge";
        }

        if (ua.Contains("chrome/") && !ua.Contains("edg/"))
        {
            return "Chrome";
        }

        if (ua.Contains("firefox/"))
        {
            return "Firefox";
        }

        if (ua.Contains("safari/") && !ua.Contains("chrome/"))
        {
            return "Safari";
        }

        return "Chrome";
    }
}

