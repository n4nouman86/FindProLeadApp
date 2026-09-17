using Microsoft.AspNetCore.Identity;

namespace FindProLead.Api.Identity;

public class ApplicationUser : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public int? SubsidiaryId { get; set; }
    public int? VerifierId { get; set; }
    public int? ClientId { get; set; }
    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
