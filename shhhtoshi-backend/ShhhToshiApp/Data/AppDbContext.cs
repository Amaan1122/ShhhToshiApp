using Microsoft.EntityFrameworkCore;
using ShhhToshiApp.Models;

namespace Shhhtoshi.Api.DB
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<WalletUser> WalletUsers { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<Referral> Referrals { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Reward> Rewards { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WalletUser>()
            .HasIndex(u => u.WalletAddress)
            .IsUnique();

            // Composite relationship for Referrals
            modelBuilder.Entity<Referral>()
                .HasOne(r => r.Referrer)
                .WithMany()
                .HasForeignKey(r => r.ReferrerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Referral>()
                .HasOne(r => r.ReferredUser)
                .WithMany()
                .HasForeignKey(r => r.ReferredUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
