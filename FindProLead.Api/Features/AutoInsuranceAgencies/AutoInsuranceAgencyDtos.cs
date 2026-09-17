namespace FindProLead.Api.Features.AutoInsuranceAgencies;

public record CreateAutoInsuranceAgencyRequest(int SubsidiaryId, string Name, string? Website, string? Email, string? Phone, string? AlternatePhone, int TransfersPerDay, string? Linkedin, bool MultiCars, bool HomeOwners, string States, string? VerifierNotes, string? Memo);

public record UpdateAutoInsuranceAgencyRequest(int SubsidiaryId, string Name, string? Website, string? Email, string? Phone, string? AlternatePhone, int TransfersPerDay, string? Linkedin, bool MultiCars, bool HomeOwners, string States, string? VerifierNotes, string? Memo);

public record AutoInsuranceAgencyDto(int Id, Guid RowId, int SubsidiaryId, string SubsidiaryName, string Name, string? Website, string? Email, string? Phone, string? AlternatePhone, int TransfersPerDay, string? Linkedin, bool MultiCars, bool HomeOwners, string States, string? VerifierNotes, string? Memo, DateTimeOffset CreatedOn);
