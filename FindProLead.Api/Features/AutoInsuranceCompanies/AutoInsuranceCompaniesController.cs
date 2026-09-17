using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.AutoInsuranceCompanies;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AutoInsuranceCompaniesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AutoInsuranceCompaniesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutoInsuranceCompanyDto>>> GetAll()
    {
        var companies = await _context.AutoInsuranceCompanies
            .OrderBy(c => c.Name)
            .Select(c => ToDto(c))
            .ToListAsync();

        return Ok(companies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AutoInsuranceCompanyDto>> GetById(int id)
    {
        var company = await _context.AutoInsuranceCompanies.FindAsync(id);
        if (company is null)
        {
            return NotFound();
        }

        return Ok(ToDto(company));
    }

    [HttpPost]
    public async Task<ActionResult<AutoInsuranceCompanyDto>> Create(CreateAutoInsuranceCompanyRequest request)
    {
        var company = new AutoInsuranceCompany
        {
            Name = request.Name
        };

        _context.AutoInsuranceCompanies.Add(company);
        await _context.SaveChangesAsync();

        var dto = ToDto(company);
        return CreatedAtAction(nameof(GetById), new { id = company.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AutoInsuranceCompanyDto>> Update(int id, UpdateAutoInsuranceCompanyRequest request)
    {
        var company = await _context.AutoInsuranceCompanies.FindAsync(id);
        if (company is null)
        {
            return NotFound();
        }

        company.Name = request.Name;

        await _context.SaveChangesAsync();

        return Ok(ToDto(company));
    }

    private static AutoInsuranceCompanyDto ToDto(AutoInsuranceCompany company)
    {
        return new AutoInsuranceCompanyDto(company.Id, company.Name, company.CreatedOn);
    }
}
