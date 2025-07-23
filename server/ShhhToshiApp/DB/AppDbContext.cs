using TalentMatch_AI.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace TalentMatch_AI.DB
{
    public class AppDbContext: IdentityDbContext<UserWallet>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // Define Database Tabel

        public DbSet<UserWallet> Users { get; set; }
    }
}
