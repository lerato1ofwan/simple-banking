using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using SimpleBanking.Api.Services.Interfaces;
using SimpleBanking.Api.Services;
using SimpleBanking.Api.Models;

namespace SimpleBanking.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(corsOptions => corsOptions
              .AddDefaultPolicy(corsPolicyBuilder => corsPolicyBuilder
                  .WithOrigins(Configuration.GetSection("AllowedOrigins").Get<string[]>())
                  .SetIsOriginAllowedToAllowWildcardSubdomains()
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()));

            // Add services to the container.

            services.AddControllers()
                 .AddJsonOptions(options =>
                 {
                     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                 });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            // Register services for DI
            services.AddScoped<ITransactionsService, TransactionsService>();
            services.AddScoped<IBankAccountService, BankAccountService>();

            var dbConnectionString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<SimpleBankingDbContext>(
                 options =>
                     options.UseSqlServer(
                         dbConnectionString));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            Console.WriteLine("Environment name = " + env.EnvironmentName);
            // Configure the HTTP request pipeline.
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(swaggerUiOptions =>
                {
                    swaggerUiOptions.SwaggerEndpoint("/swagger/v1/swagger.json", "SimpleBanking.Api v1");
                });
            }
            app.UseRouting();
            app.UseHttpsRedirection();
            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}