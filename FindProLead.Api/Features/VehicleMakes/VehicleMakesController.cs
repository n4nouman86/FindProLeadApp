using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.VehicleMakes;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehicleMakesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VehicleMakesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleMakeDto>>> GetAll()
    {
        var makes = await _context.VehicleMakes
            .OrderBy(m => m.Name)
            .Select(m => ToDto(m))
            .ToListAsync();

        return Ok(makes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleMakeDto>> GetById(int id)
    {
        var make = await _context.VehicleMakes.FindAsync(id);
        if (make is null)
        {
            return NotFound();
        }

        return Ok(ToDto(make));
    }

    [HttpPost]
    public async Task<ActionResult<VehicleMakeDto>> Create(CreateVehicleMakeRequest request)
    {
        var make = new VehicleMake
        {
            Name = request.Name
        };

        _context.VehicleMakes.Add(make);
        await _context.SaveChangesAsync();

        var dto = ToDto(make);
        return CreatedAtAction(nameof(GetById), new { id = make.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleMakeDto>> Update(int id, UpdateVehicleMakeRequest request)
    {
        var make = await _context.VehicleMakes.FindAsync(id);
        if (make is null)
        {
            return NotFound();
        }

        make.Name = request.Name;

        await _context.SaveChangesAsync();

        return Ok(ToDto(make));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var make = await _context.VehicleMakes.FindAsync(id);
        if (make is null)
        {
            return NotFound();
        }

        _context.VehicleMakes.Remove(make);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static VehicleMakeDto ToDto(VehicleMake make)
    {
        return new VehicleMakeDto(make.Id, make.Name, make.CreatedOn);
    }
}
