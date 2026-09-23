using Microsoft.AspNetCore.Identity;

namespace FindProLead.Api.Identity;

public class ApplicationUser : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public int? VerifierCompanyId { get; set; }
    public int? AutoInsuranceAgencyId { get; set; }
    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
