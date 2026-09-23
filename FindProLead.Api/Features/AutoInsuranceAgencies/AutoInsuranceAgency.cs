using System.ComponentModel.DataAnnotations;
using FindProLead.Api.Features.SubsidiaryCompanies;

namespace FindProLead.Api.Features.AutoInsuranceAgencies;

public class AutoInsuranceAgency
{
    public int Id { get; set; }
    public Guid RowId { get; set; } = Guid.NewGuid();
    public int SubsidiaryCompanyId { get; set; }
    public SubsidiaryCompany? SubsidiaryCompany { get; set; }

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Website { get; set; }

    [MaxLength(50)]
    public string? Email { get; set; }

    [MaxLength(50)]
    public string? Phone { get; set; }

    [MaxLength(50)]
    public string? AlternatePhone { get; set; }

    public int TransfersPerDay { get; set; }

    [MaxLength(256)]
    public string? Linkedin { get; set; }

    public bool MultiCars { get; set; }

    public bool HomeOwners { get; set; }

    [MaxLength(50)]
    public string States { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? VerifierNotes { get; set; }

    [MaxLength(256)]
    public string? Memo { get; set; }

    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
