using Microsoft.EntityFrameworkCore;

namespace ClinicManagement.Api.Models;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public DbSet<Roles> Roles { get; set; }
    public DbSet<StaffUsers> StaffUsers { get; set; }
    public DbSet<StaffSessions> StaffSessions { get; set; }
    public DbSet<StaffAccessLogs> StaffAccessLogs { get; set; }
    public DbSet<ServiceCategories> ServiceCategories { get; set; }
    public DbSet<ClinicalServices> ClinicalServices { get; set; }
    public DbSet<ClinicalServiceIndications> ClinicalServiceIndications { get; set; }
    public DbSet<Patients> Patients { get; set; }
    public DbSet<Appointments> Appointments { get; set; }
    public DbSet<AppointmentStatusHistory> AppointmentStatusHistory { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Roles>(entity =>
        {
            entity.HasIndex(x => x.Code).IsUnique();
        });

        modelBuilder.Entity<StaffUsers>(entity =>
        {
            entity.HasIndex(x => x.Username).IsUnique();
            entity.HasIndex(x => x.StaffCode).IsUnique();
            entity.HasIndex(x => x.Email).IsUnique().HasFilter("[email] IS NOT NULL");
            entity.HasIndex(x => x.LicenseNumber).IsUnique().HasFilter("[license_number] IS NOT NULL");

            entity.HasOne(x => x.Role)
                .WithMany(x => x.StaffUsers)
                .HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StaffSessions>(entity =>
        {
            entity.HasIndex(x => x.RefreshTokenHash).IsUnique();
            entity.HasIndex(x => new { x.StaffId, x.ExpiresAt });

            entity.HasOne(x => x.Staff)
                .WithMany(x => x.Sessions)
                .HasForeignKey(x => x.StaffId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StaffAccessLogs>(entity =>
        {
            entity.HasIndex(x => new { x.StaffId, x.AccessTime });
            entity.HasIndex(x => x.AccessTime);

            entity.HasOne(x => x.Staff)
                .WithMany(x => x.AccessLogs)
                .HasForeignKey(x => x.StaffId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ServiceCategories>(entity =>
        {
            entity.HasIndex(x => x.Code).IsUnique();
        });

        modelBuilder.Entity<ClinicalServices>(entity =>
        {
            entity.HasIndex(x => x.ServiceCode).IsUnique();
            entity.HasIndex(x => x.CategoryId);

            entity.HasOne(x => x.Category)
                .WithMany(x => x.Services)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ClinicalServiceIndications>(entity =>
        {
            entity.HasIndex(x => x.ServiceId);

            entity.HasOne(x => x.Service)
                .WithMany(x => x.Indications)
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Patients>(entity =>
        {
            entity.HasIndex(x => x.PatientCode).IsUnique();
            entity.HasIndex(x => x.Phone);
        });

        modelBuilder.Entity<Appointments>(entity =>
        {
            entity.HasIndex(x => x.AppointmentCode).IsUnique();
            entity.HasIndex(x => new { x.Phone, x.AppointmentDate, x.AppointmentTime });
            entity.HasIndex(x => x.ServiceId);

            entity.HasOne(x => x.Patient)
                .WithMany(x => x.Appointments)
                .HasForeignKey(x => x.PatientId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.Service)
                .WithMany()
                .HasForeignKey(x => x.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AppointmentStatusHistory>(entity =>
        {
            entity.HasIndex(x => x.AppointmentId);
            entity.HasIndex(x => x.ChangedAt);

            entity.HasOne(x => x.Appointment)
                .WithMany(x => x.StatusHistory)
                .HasForeignKey(x => x.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.ChangedByStaff)
                .WithMany()
                .HasForeignKey(x => x.ChangedByStaffId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}

