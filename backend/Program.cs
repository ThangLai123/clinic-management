using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using ClinicManagement.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

// 1. Database Context
var connection = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.\\SQLEXPRESS;Database=clinic_managerment;Trusted_Connection=True;TrustServerCertificate=True;";
builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(connection));

// 2. Password Hasher
builder.Services.AddScoped<IPasswordHasher<StaffUsers>, PasswordHasher<StaffUsers>>();

// 3. Authentication & JWT
var signingKey = builder.Configuration["Jwt:SigningKey"]
    ?? "PTfLCKBpQigRfSfWsBe181A/AkofXGYmSRvYLdkd76AUp83JEmxbLXIf9zfGO+t4";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "ClinicManagement.Api",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "ClinicManagement.Frontend",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30),
            NameClaimType = JwtRegisteredClaimNames.Sub,
            RoleClaimType = "role"
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var claims = context.Principal;
                var validStaff = long.TryParse(claims?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value, out var staffId);
                var validSession = long.TryParse(claims?.FindFirst("sid")?.Value, out var sessionId);
                if (!validStaff || !validSession)
                {
                    context.Fail("Invalid session claims.");
                    return;
                }

                var role = claims!.FindFirst("role")?.Value ?? string.Empty;
                var db = context.HttpContext.RequestServices.GetRequiredService<DataContext>();
                var now = DateTime.UtcNow;

                var isActive = await db.StaffSessions.AsNoTracking().AnyAsync(x =>
                    x.Id == sessionId &&
                    x.StaffId == staffId &&
                    x.RevokedAt == null &&
                    x.ExpiresAt > now &&
                    x.Staff.Status == "ACTIVE" &&
                    x.Staff.Role.Code == role);

                if (!isActive)
                {
                    context.Fail("Session expired or revoked.");
                }
            },
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                await context.Response.WriteAsJsonAsync(new ProblemDetails
                {
                    Status = 401,
                    Title = "Phiên đăng nhập không hợp lệ hoặc đã hết hạn"
                });
            },
            OnForbidden = async context =>
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsJsonAsync(new ProblemDetails
                {
                    Status = 403,
                    Title = "Bạn không có quyền truy cập chức năng này"
                });
            }
        };
    });

builder.Services.AddAuthorization();

// 4. CORS
builder.Services.AddCors(options => options.AddPolicy("FrontendDevCors", policy =>
    policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

// 5. Rate Limiter
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    options.OnRejected = async (context, _) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = 429,
            Title = "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 1 phút."
        });
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// CLI Command: Reset / Create Admin
if (args.Contains("--reset-admin", StringComparer.OrdinalIgnoreCase) ||
    args.Contains("--bootstrap-admin", StringComparer.OrdinalIgnoreCase))
{
    await HandleAdminCliAsync(app.Services);
    return;
}

app.UseHttpsRedirection();
app.UseCors("FrontendDevCors");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// CLI Admin helper function
static async Task HandleAdminCliAsync(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<StaffUsers>>();

    var role = await db.Roles.FirstOrDefaultAsync(x => x.Code == "ADMIN");
    if (role == null)
    {
        Console.WriteLine("Lỗi: Vai trò ADMIN chưa có trong cơ sở dữ liệu.");
        return;
    }

    Console.Write("Tên đăng nhập Admin [admin]: ");
    var username = Console.ReadLine()?.Trim();
    if (string.IsNullOrWhiteSpace(username)) username = "admin";

    Console.Write("Họ tên Admin [Quản trị viên]: ");
    var fullName = Console.ReadLine()?.Trim();
    if (string.IsNullOrWhiteSpace(fullName)) fullName = "Quản trị viên";

    Console.Write("Nhập mật khẩu mới: ");
    var password = ReadPassword();
    Console.WriteLine();

    Console.Write("Nhập lại mật khẩu: ");
    var confirmPassword = ReadPassword();
    Console.WriteLine();

    if (string.IsNullOrWhiteSpace(password) || password != confirmPassword)
    {
        Console.WriteLine("Lỗi: Mật khẩu không khớp hoặc bị rỗng.");
        return;
    }

    var existing = await db.StaffUsers.FirstOrDefaultAsync(x => x.Username == username);
    var now = DateTime.UtcNow;

    if (existing != null)
    {
        existing.PasswordHash = hasher.HashPassword(existing, password);
        existing.UpdatedAt = now;
        await db.SaveChangesAsync();
        Console.WriteLine($"Đã cập nhật mật khẩu mới thành công cho tài khoản @{username} trong SQL Server.");
    }
    else
    {
        var staff = new StaffUsers
        {
            StaffCode = "AD" + Convert.ToHexString(RandomNumberGenerator.GetBytes(6)),
            Username = username,
            FullName = fullName,
            RoleId = role.Id,
            Role = role,
            Status = "ACTIVE",
            CreatedAt = now,
            UpdatedAt = now
        };
        staff.PasswordHash = hasher.HashPassword(staff, password);
        db.StaffUsers.Add(staff);
        await db.SaveChangesAsync();
        Console.WriteLine($"Đã tạo mới tài khoản Admin @{username} thành công trong SQL Server.");
    }
}

static string ReadPassword()
{
    var pass = new StringBuilder();
    while (true)
    {
        var key = Console.ReadKey(intercept: true);
        if (key.Key == ConsoleKey.Enter) break;
        if (key.Key == ConsoleKey.Backspace && pass.Length > 0)
        {
            pass.Remove(pass.Length - 1, 1);
            continue;
        }
        if (!char.IsControl(key.KeyChar))
        {
            pass.Append(key.KeyChar);
        }
    }
    return pass.ToString();
}
