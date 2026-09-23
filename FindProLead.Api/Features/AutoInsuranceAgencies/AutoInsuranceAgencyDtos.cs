namespace FindProLead.Api.Features.AutoInsuranceAgencies;

public record CreateAutoInsuranceAgencyRequest(int SubsidiaryCompanyId, string Name, string? Website, string? Email, string? Phone, string? AlternatePhone, int TransfersPerDay, string? Linkedin, bool MultiCars, bool HomeOwners, string States, string? VerifierNotes, string? Memo);

public record UpdateAutoInsuranceAgencyRequest(int SubsidiaryCompanyId, string Name, string? Website, string? Email, string? Phone, string? AlternatePhone, int TransfersPerDay, string? Linkedin, bool MultiCars, bool HomeOwners, string States, string? VerifierNotes, string? Memo);

public record AutoInsuranceAgencyDto(int Id, Guid RowId, int SubsidiaryCompanyId, string SubsidiaryCompanyName, string Name, string? Website, string? Email, string? Phone, string? AlternatePhone, int TransfersPerDay, string? Linkedin, bool MultiCars, bool HomeOwners, string States, string? VerifierNotes, string? Memo, DateTimeOffset CreatedOn);
