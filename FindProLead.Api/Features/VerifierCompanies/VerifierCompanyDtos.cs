namespace FindProLead.Api.Features.VerifierCompanies;

public record CreateVerifierCompanyRequest(string Name, string? Website, string? Email, string? Linkedin, string? Memo);

public record UpdateVerifierCompanyRequest(string Name, string? Website, string? Email, string? Linkedin, string? Memo);

public record VerifierCompanyDto(int Id, Guid RowId, string Name, string? Website, string? Email, string? Linkedin, string? Memo, DateTimeOffset CreatedOn);
