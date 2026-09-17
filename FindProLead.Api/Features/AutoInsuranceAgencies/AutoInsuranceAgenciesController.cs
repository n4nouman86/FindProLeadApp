using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.AutoInsuranceAgencies;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AutoInsuranceAgenciesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AutoInsuranceAgenciesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutoInsuranceAgencyDto>>> GetAll()
    {
        var agencies = await _context.AutoInsuranceAgencies
            .Include(a => a.Subsidiary)
            .OrderByDescending(a => a.CreatedOn)
            .Select(a => ToDto(a))
            .ToListAsync();

        return Ok(agencies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AutoInsuranceAgencyDto>> GetById(int id)
    {
        var agency = await _context.AutoInsuranceAgencies
            .Include(a => a.Subsidiary)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (agency is null)
        {
            return NotFound();
        }

        return Ok(ToDto(agency));
    }

    [HttpPost]
    public async Task<ActionResult<AutoInsuranceAgencyDto>> Create(CreateAutoInsuranceAgencyRequest request)
    {
        var subsidiaryExists = await _context.Subsidiaries.AnyAsync(s => s.Id == request.SubsidiaryId);
        if (!subsidiaryExists)
        {
            ModelState.AddModelError(nameof(request.SubsidiaryId), "Subsidiary not found.");
            return ValidationProblem(ModelState);
        }

        var agency = new AutoInsuranceAgency
        {
            SubsidiaryId = request.SubsidiaryId,
            Name = request.Name,
            Website = request.Website,
            Email = request.Email,
            Phone = request.Phone,
            AlternatePhone = request.AlternatePhone,
            TransfersPerDay = request.TransfersPerDay,
            Linkedin = request.Linkedin,
            MultiCars = request.MultiCars,
            HomeOwners = request.HomeOwners,
            States = request.States,
            VerifierNotes = request.VerifierNotes,
            Memo = request.Memo
        };

        _context.AutoInsuranceAgencies.Add(agency);
        await _context.SaveChangesAsync();

        await _context.Entry(agency).Reference(a => a.Subsidiary).LoadAsync();

        var dto = ToDto(agency);
        return CreatedAtAction(nameof(GetById), new { id = agency.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AutoInsuranceAgencyDto>> Update(int id, UpdateAutoInsuranceAgencyRequest request)
    {
        var agency = await _context.AutoInsuranceAgencies
            .Include(a => a.Subsidiary)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (agency is null)
        {
            return NotFound();
        }

        var subsidiaryExists = await _context.Subsidiaries.AnyAsync(s => s.Id == request.SubsidiaryId);
        if (!subsidiaryExists)
        {
            ModelState.AddModelError(nameof(request.SubsidiaryId), "Subsidiary not found.");
            return ValidationProblem(ModelState);
        }

        agency.SubsidiaryId = request.SubsidiaryId;
        agency.Name = request.Name;
        agency.Website = request.Website;
        agency.Email = request.Email;
        agency.Phone = request.Phone;
        agency.AlternatePhone = request.AlternatePhone;
        agency.TransfersPerDay = request.TransfersPerDay;
        agency.Linkedin = request.Linkedin;
        agency.MultiCars = request.MultiCars;
        agency.HomeOwners = request.HomeOwners;
        agency.States = request.States;
        agency.VerifierNotes = request.VerifierNotes;
        agency.Memo = request.Memo;

        await _context.SaveChangesAsync();
        await _context.Entry(agency).Reference(a => a.Subsidiary).LoadAsync();

        return Ok(ToDto(agency));
    }

    private static AutoInsuranceAgencyDto ToDto(AutoInsuranceAgency agency)
    {
        return new AutoInsuranceAgencyDto(
            agency.Id,
            agency.RowId,
            agency.SubsidiaryId,
            agency.Subsidiary?.Name ?? string.Empty,
            agency.Name,
            agency.Website,
            agency.Email,
            agency.Phone,
            agency.AlternatePhone,
            agency.TransfersPerDay,
            agency.Linkedin,
            agency.MultiCars,
            agency.HomeOwners,
            agency.States,
            agency.VerifierNotes,
            agency.Memo,
            agency.CreatedOn);
    }
}
