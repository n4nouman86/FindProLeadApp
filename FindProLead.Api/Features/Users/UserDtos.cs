namespace FindProLead.Api.Features.Users;

public record CreateUserRequest(string FirstName, string LastName, string Email, string Password, int? SubsidiaryId, int? VerifierId, int? ClientId);

public record UpdateUserRequest(string FirstName, string LastName, string Email, int? SubsidiaryId, int? VerifierId, int? ClientId);

public record UserDto(string Id, string FirstName, string LastName, string Email, string UserName, bool IsLocked, int? SubsidiaryId, int? VerifierId, int? ClientId, DateTimeOffset CreatedOn);
