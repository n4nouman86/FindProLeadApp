namespace FindProLead.Api.Features.AutoInsuranceCompanies;

public record CreateAutoInsuranceCompanyRequest(string Name);

public record UpdateAutoInsuranceCompanyRequest(string Name);

public record AutoInsuranceCompanyDto(int Id, string Name, DateTimeOffset CreatedOn);
