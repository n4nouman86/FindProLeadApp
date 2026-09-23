namespace FindProLead.Api.Features.AutoLeads;

public record CreateAutoLeadRequest(string FirstName, string LastName, string Phone, string? Email, DateOnly DateOfBirth, int AutoInsuranceAgencyId, int? VerifierCompanyId, string AppUserId);

public record UpdateAutoLeadRequest(string FirstName, string LastName, string Phone, string? Email, DateOnly DateOfBirth, int AutoInsuranceAgencyId, int? VerifierCompanyId, string AppUserId);

public record AutoLeadDto(int Id, Guid RowId, string FirstName, string LastName, string Phone, string? Email, DateOnly DateOfBirth, int AutoInsuranceAgencyId, string AutoInsuranceAgencyName, int? VerifierCompanyId, string VerifierCompanyName, string AppUserId, string AppUserName);
