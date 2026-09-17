namespace FindProLead.Api.Features.Subsidiaries;

public record CreateSubsidiaryRequest(string Name, string? Website, string? Email, string? Phone, string? Linkedin, string? Memo);

public record UpdateSubsidiaryRequest(string Name, string? Website, string? Email, string? Phone, string? Linkedin, string? Memo);

public record SubsidiaryDto(int Id, Guid RowId, string Name, string? Website, string? Email, string? Phone, string? Linkedin, string? Memo, DateTimeOffset CreatedOn);
