using System.ComponentModel.DataAnnotations;
using FindProLead.Api.Features.AutoInsuranceAgencies;
using FindProLead.Api.Features.VerifierCompanies;
using FindProLead.Api.Identity;

namespace FindProLead.Api.Features.AutoLeads;

public class AutoLead
{
    public int Id { get; set; }
    public Guid RowId { get; set; } = Guid.NewGuid();

    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Email { get; set; }

    public DateOnly DateOfBirth { get; set; }
    public int AutoInsuranceAgencyId { get; set; }
    public AutoInsuranceAgency? AutoInsuranceAgency { get; set; }

    public int? VerifierCompanyId { get; set; }
    public VerifierCompany? VerifierCompany { get; set; }

    [MaxLength(450)]
    public string AppUserId { get; set; } = string.Empty;
    public ApplicationUser? AppUser { get; set; }
}
