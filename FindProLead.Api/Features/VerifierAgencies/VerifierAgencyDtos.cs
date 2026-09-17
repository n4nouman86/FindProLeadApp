namespace FindProLead.Api.Features.VerifierAgencies;

public record CreateVerifierAgencyRequest(string Name, string? Website, string? Email, string? Linkedin, string? Memo);

public record UpdateVerifierAgencyRequest(string Name, string? Website, string? Email, string? Linkedin, string? Memo);

public record VerifierAgencyDto(int Id, Guid RowId, string Name, string? Website, string? Email, string? Linkedin, string? Memo, DateTimeOffset CreatedOn);
