using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Identity;
using FindProLead.Api.Features.Subsidiaries;
using FindProLead.Api.Features.VerifierAgencies;
using FindProLead.Api.Features.AutoInsuranceAgencies;
using FindProLead.Api.Features.AutoInsuranceCompanies;

namespace FindProLead.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Subsidiary> Subsidiaries { get; set; }
    public DbSet<VerifierAgency> VerifierAgencies { get; set; }
    public DbSet<AutoInsuranceAgency> AutoInsuranceAgencies { get; set; }
    public DbSet<AutoInsuranceCompany> AutoInsuranceCompanies { get; set; }
}

