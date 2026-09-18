using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.VehicleModels;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehicleModelsController : ControllerBase
{
    private readonly AppDbContext _context;

    public VehicleModelsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleModelDto>>> GetAll()
    {
        var models = await _context.VehicleModels
            .OrderBy(m => m.Name)
            .Select(m => ToDto(m))
            .ToListAsync();

        return Ok(models);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleModelDto>> GetById(int id)
    {
        var model = await _context.VehicleModels.FindAsync(id);
        if (model is null)
        {
            return NotFound();
        }

        return Ok(ToDto(model));
    }

    [HttpPost]
    public async Task<ActionResult<VehicleModelDto>> Create(CreateVehicleModelRequest request)
    {
        var model = new VehicleModel
        {
            Name = request.Name
        };

        _context.VehicleModels.Add(model);
        await _context.SaveChangesAsync();

        var dto = ToDto(model);
        return CreatedAtAction(nameof(GetById), new { id = model.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleModelDto>> Update(int id, UpdateVehicleModelRequest request)
    {
        var model = await _context.VehicleModels.FindAsync(id);
        if (model is null)
        {
            return NotFound();
        }

        model.Name = request.Name;

        await _context.SaveChangesAsync();

        return Ok(ToDto(model));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var model = await _context.VehicleModels.FindAsync(id);
        if (model is null)
        {
            return NotFound();
        }

        _context.VehicleModels.Remove(model);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static VehicleModelDto ToDto(VehicleModel model)
    {
        return new VehicleModelDto(model.Id, model.Name, model.CreatedOn);
    }
}
