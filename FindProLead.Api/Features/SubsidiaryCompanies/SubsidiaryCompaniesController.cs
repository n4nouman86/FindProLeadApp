using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.SubsidiaryCompanies;

[ApiController]
[Route("api/subsidiary-companies")]
[Authorize]
public class SubsidiaryCompaniesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SubsidiaryCompaniesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubsidiaryCompanyDto>>> GetAll()
    {
        var subsidiaries = await _context.SubsidiaryCompanies
            .OrderByDescending(s => s.CreatedOn)
            .Select(s => ToDto(s))
            .ToListAsync();

        return Ok(subsidiaries);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SubsidiaryCompanyDto>> GetById(int id)
    {
        var subsidiary = await _context.SubsidiaryCompanies.FindAsync(id);
        if (subsidiary is null)
        {
            return NotFound();
        }

        return Ok(ToDto(subsidiary));
    }

    [HttpPost]
    public async Task<ActionResult<SubsidiaryCompanyDto>> Create(CreateSubsidiaryCompanyRequest request)
    {
        var subsidiary = new SubsidiaryCompany
        {
            Name = request.Name,
            Website = request.Website,
            Email = request.Email,
            Phone = request.Phone,
            Linkedin = request.Linkedin,
            Memo = request.Memo
        };

        _context.SubsidiaryCompanies.Add(subsidiary);
        await _context.SaveChangesAsync();

        var dto = ToDto(subsidiary);
        return CreatedAtAction(nameof(GetById), new { id = subsidiary.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SubsidiaryCompanyDto>> Update(int id, UpdateSubsidiaryCompanyRequest request)
    {
        var subsidiary = await _context.SubsidiaryCompanies.FindAsync(id);
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

    private static SubsidiaryCompanyDto ToDto(SubsidiaryCompany subsidiary)
    {
        return new SubsidiaryCompanyDto(
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
