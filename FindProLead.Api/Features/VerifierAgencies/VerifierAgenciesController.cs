using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.VerifierAgencies;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VerifierAgenciesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VerifierAgenciesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VerifierAgencyDto>>> GetAll()
    {
        var agencies = await _context.VerifierAgencies
            .OrderByDescending(a => a.CreatedOn)
            .Select(a => ToDto(a))
            .ToListAsync();

        return Ok(agencies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VerifierAgencyDto>> GetById(int id)
    {
        var agency = await _context.VerifierAgencies.FindAsync(id);
        if (agency is null)
        {
            return NotFound();
        }

        return Ok(ToDto(agency));
    }

    [HttpPost]
    public async Task<ActionResult<VerifierAgencyDto>> Create(CreateVerifierAgencyRequest request)
    {
        var agency = new VerifierAgency
        {
            Name = request.Name,
            Website = request.Website,
            Email = request.Email,
            Linkedin = request.Linkedin,
            Memo = request.Memo
        };

        _context.VerifierAgencies.Add(agency);
        await _context.SaveChangesAsync();

        var dto = ToDto(agency);
        return CreatedAtAction(nameof(GetById), new { id = agency.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VerifierAgencyDto>> Update(int id, UpdateVerifierAgencyRequest request)
    {
        var agency = await _context.VerifierAgencies.FindAsync(id);
        if (agency is null)
        {
            return NotFound();
        }

        agency.Name = request.Name;
        agency.Website = request.Website;
        agency.Email = request.Email;
        agency.Linkedin = request.Linkedin;
        agency.Memo = request.Memo;

        await _context.SaveChangesAsync();

        return Ok(ToDto(agency));
    }

    private static VerifierAgencyDto ToDto(VerifierAgency agency)
    {
        return new VerifierAgencyDto(
            agency.Id,
            agency.RowId,
            agency.Name,
            agency.Website,
            agency.Email,
            agency.Linkedin,
            agency.Memo,
            agency.CreatedOn);
    }
}
