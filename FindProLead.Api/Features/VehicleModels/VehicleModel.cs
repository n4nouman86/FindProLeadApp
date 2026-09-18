using System.ComponentModel.DataAnnotations;

namespace FindProLead.Api.Features.VehicleModels;

public class VehicleModel
{
    public int Id { get; set; }

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
