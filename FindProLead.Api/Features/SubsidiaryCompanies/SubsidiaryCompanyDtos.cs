namespace FindProLead.Api.Features.SubsidiaryCompanies;

public record CreateSubsidiaryCompanyRequest(string Name, string? Website, string? Email, string? Phone, string? Linkedin, string? Memo);

public record UpdateSubsidiaryCompanyRequest(string Name, string? Website, string? Email, string? Phone, string? Linkedin, string? Memo);

public record SubsidiaryCompanyDto(int Id, Guid RowId, string Name, string? Website, string? Email, string? Phone, string? Linkedin, string? Memo, DateTimeOffset CreatedOn);
