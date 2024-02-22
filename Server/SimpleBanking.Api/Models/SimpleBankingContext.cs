
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using SimpleBanking.Api.Models.Dao;

namespace SimpleBanking.Api.Models
{
    public class SimpleBankingDbContext : DbContext
    {
        public SimpleBankingDbContext(DbContextOptions<SimpleBankingDbContext> options) : base(options)
        {
        }

        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
              .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
              .AddJsonFile("appsettings.json")
              .Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }

    }

    public class SimpleBankingDbContextFactory : IDesignTimeDbContextFactory<SimpleBankingDbContext>
    {
        public SimpleBankingDbContextFactory()
        {
        }

        public SimpleBankingDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                       .SetBasePath(Directory.GetCurrentDirectory())
                       .AddJsonFile("appsettings.json")
                       .Build();

            var optionsBuilder = new DbContextOptionsBuilder<SimpleBankingDbContext>();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

            return new SimpleBankingDbContext(optionsBuilder.Options);
        }
    }
}