using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Identity;
using FindProLead.Api.Features.SubsidiaryCompanies;
using FindProLead.Api.Features.VerifierCompanies;
using FindProLead.Api.Features.AutoInsuranceAgencies;
using FindProLead.Api.Features.AutoLeads;

namespace FindProLead.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<SubsidiaryCompany> SubsidiaryCompanies { get; set; }
    public DbSet<VerifierCompany> VerifierCompanies { get; set; }
    public DbSet<AutoInsuranceAgency> AutoInsuranceAgencies { get; set; }
    public DbSet<AutoLead> AutoLeads { get; set; }
}

