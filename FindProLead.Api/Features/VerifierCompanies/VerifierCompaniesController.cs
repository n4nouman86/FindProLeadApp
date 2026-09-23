using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.VerifierCompanies;

[ApiController]
[Route("api/verifier-companies")]
[Authorize]
public class VerifierCompaniesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VerifierCompaniesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VerifierCompanyDto>>> GetAll()
    {
        var companies = await _context.VerifierCompanies
            .OrderByDescending(a => a.CreatedOn)
            .Select(a => ToDto(a))
            .ToListAsync();

        return Ok(companies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VerifierCompanyDto>> GetById(int id)
    {
        var company = await _context.VerifierCompanies.FindAsync(id);
        if (company is null)
        {
            return NotFound();
        }

        return Ok(ToDto(company));
    }

    [HttpPost]
    public async Task<ActionResult<VerifierCompanyDto>> Create(CreateVerifierCompanyRequest request)
    {
        var company = new VerifierCompany
        {
            Name = request.Name,
            Website = request.Website,
            Email = request.Email,
            Linkedin = request.Linkedin,
            Memo = request.Memo
        };

        _context.VerifierCompanies.Add(company);
        await _context.SaveChangesAsync();

        var dto = ToDto(company);
        return CreatedAtAction(nameof(GetById), new { id = company.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VerifierCompanyDto>> Update(int id, UpdateVerifierCompanyRequest request)
    {
        var company = await _context.VerifierCompanies.FindAsync(id);
        if (company is null)
        {
            return NotFound();
        }

        company.Name = request.Name;
        company.Website = request.Website;
        company.Email = request.Email;
        company.Linkedin = request.Linkedin;
        company.Memo = request.Memo;

        await _context.SaveChangesAsync();

        return Ok(ToDto(company));
    }

    private static VerifierCompanyDto ToDto(VerifierCompany company)
    {
        return new VerifierCompanyDto(
            company.Id,
            company.RowId,
            company.Name,
            company.Website,
            company.Email,
            company.Linkedin,
            company.Memo,
            company.CreatedOn);
    }
}
