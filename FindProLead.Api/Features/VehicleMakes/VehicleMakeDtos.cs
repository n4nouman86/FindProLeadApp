namespace FindProLead.Api.Features.VehicleMakes;

public record CreateVehicleMakeRequest(string Name);

public record UpdateVehicleMakeRequest(string Name);

public record VehicleMakeDto(int Id, string Name, DateTimeOffset CreatedOn);
