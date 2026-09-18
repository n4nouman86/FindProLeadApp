using System.ComponentModel.DataAnnotations;

namespace FindProLead.Api.Features.VehicleMakes;

public class VehicleMake
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
