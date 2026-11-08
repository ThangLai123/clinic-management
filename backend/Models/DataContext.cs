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
    }
}

