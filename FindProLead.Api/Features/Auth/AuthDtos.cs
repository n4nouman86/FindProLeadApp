namespace FindProLead.Api.Features.Auth;

public record LoginRequest(string Email, string Password);

public record LoginResponse(string Token, DateTime ExpiresAt, string FirstName, string LastName, string Email, IEnumerable<string> Roles);
