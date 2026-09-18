namespace FindProLead.Api.Features.VehicleModels;

public record CreateVehicleModelRequest(string Name);

public record UpdateVehicleModelRequest(string Name);

public record VehicleModelDto(int Id, string Name, DateTimeOffset CreatedOn);
