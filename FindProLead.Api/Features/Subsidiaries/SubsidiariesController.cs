using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.Subsidiaries;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubsidiariesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SubsidiariesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubsidiaryDto>>> GetAll()
    {
        var subsidiaries = await _context.Subsidiaries
            .OrderByDescending(s => s.CreatedOn)
            .Select(s => ToDto(s))
            .ToListAsync();

        return Ok(subsidiaries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SubsidiaryDto>> GetById(int id)
    {
        var subsidiary = await _context.Subsidiaries.FindAsync(id);
        if (subsidiary is null)
        {
            return NotFound();
        }

        return Ok(ToDto(subsidiary));
    }

    [HttpPost]
    public async Task<ActionResult<SubsidiaryDto>> Create(CreateSubsidiaryRequest request)
    {
        var subsidiary = new Subsidiary
        {
            Name = request.Name,
            Website = request.Website,
            Email = request.Email,
            Phone = request.Phone,
            Linkedin = request.Linkedin,
            Memo = request.Memo
        };

        _context.Subsidiaries.Add(subsidiary);
        await _context.SaveChangesAsync();

        var dto = ToDto(subsidiary);
        return CreatedAtAction(nameof(GetById), new { id = subsidiary.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SubsidiaryDto>> Update(int id, UpdateSubsidiaryRequest request)
    {
        var subsidiary = await _context.Subsidiaries.FindAsync(id);
        if (subsidiary is null)
        {
            return NotFound();
        }

        subsidiary.Name = request.Name;
        subsidiary.Website = request.Website;
        subsidiary.Email = request.Email;
        subsidiary.Phone = request.Phone;
        subsidiary.Linkedin = request.Linkedin;
        subsidiary.Memo = request.Memo;

        await _context.SaveChangesAsync();

        return Ok(ToDto(subsidiary));
    }

    private static SubsidiaryDto ToDto(Subsidiary subsidiary)
    {
        return new SubsidiaryDto(
            subsidiary.Id,
            subsidiary.RowId,
            subsidiary.Name,
            subsidiary.Website,
            subsidiary.Email,
            subsidiary.Phone,
            subsidiary.Linkedin,
            subsidiary.Memo,
            subsidiary.CreatedOn);
    }
}
