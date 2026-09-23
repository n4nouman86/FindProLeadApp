namespace FindProLead.Api.Features.Users;

public record CreateUserRequest(string FirstName, string LastName, string Email, string Password, int? VerifierCompanyId, int? AutoInsuranceAgencyId, string? Role);

public record UpdateUserRequest(string FirstName, string LastName, string Email, int? VerifierCompanyId, int? AutoInsuranceAgencyId, string? Role);

public record UserDto(string Id, string FirstName, string LastName, string Email, string UserName, bool IsLocked, int? VerifierCompanyId, int? AutoInsuranceAgencyId, string? Role, DateTimeOffset CreatedOn);
