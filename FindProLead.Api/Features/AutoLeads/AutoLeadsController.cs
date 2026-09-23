using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FindProLead.Api.Data;

namespace FindProLead.Api.Features.AutoLeads;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AutoLeadsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AutoLeadsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AutoLeadDto>>> GetAll()
    {
        var leads = await _context.AutoLeads
            .Include(lead => lead.AutoInsuranceAgency)
            .Include(lead => lead.VerifierCompany)
            .Include(lead => lead.AppUser)
            .OrderByDescending(lead => lead.Id)
            .Select(lead => ToDto(lead))
            .ToListAsync();

        return Ok(leads);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AutoLeadDto>> GetById(int id)
    {
        var lead = await _context.AutoLeads
            .Include(item => item.AutoInsuranceAgency)
            .Include(item => item.VerifierCompany)
            .Include(item => item.AppUser)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (lead is null)
        {
            return NotFound();
        }

        return Ok(ToDto(lead));
    }

    [HttpPost]
    public async Task<ActionResult<AutoLeadDto>> Create(CreateAutoLeadRequest request)
    {
        var validationError = await ValidateReferences(request.AutoInsuranceAgencyId, request.VerifierCompanyId, request.AppUserId);
        if (validationError is not null)
        {
            return validationError;
        }

        var lead = new AutoLead
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Phone = request.Phone,
            Email = request.Email,
            DateOfBirth = request.DateOfBirth,
            AutoInsuranceAgencyId = request.AutoInsuranceAgencyId,
            VerifierCompanyId = request.VerifierCompanyId,
            AppUserId = request.AppUserId
        };

        _context.AutoLeads.Add(lead);
        await _context.SaveChangesAsync();
        await LoadReferences(lead);

        return CreatedAtAction(nameof(GetById), new { id = lead.Id }, ToDto(lead));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AutoLeadDto>> Update(int id, UpdateAutoLeadRequest request)
    {
        var lead = await _context.AutoLeads
            .FirstOrDefaultAsync(item => item.Id == id);

        if (lead is null)
        {
            return NotFound();
        }

        var validationError = await ValidateReferences(request.AutoInsuranceAgencyId, request.VerifierCompanyId, request.AppUserId);
        if (validationError is not null)
        {
            return validationError;
        }

        lead.FirstName = request.FirstName;
        lead.LastName = request.LastName;
        lead.Phone = request.Phone;
        lead.Email = request.Email;
        lead.DateOfBirth = request.DateOfBirth;
        lead.AutoInsuranceAgencyId = request.AutoInsuranceAgencyId;
        lead.VerifierCompanyId = request.VerifierCompanyId;
        lead.AppUserId = request.AppUserId;

        await _context.SaveChangesAsync();
        await LoadReferences(lead);

        return Ok(ToDto(lead));
    }

    private async Task<ActionResult?> ValidateReferences(int agencyId, int? verifierCompanyId, string appUserId)
    {
        if (!await _context.AutoInsuranceAgencies.AnyAsync(agency => agency.Id == agencyId))
        {
            ModelState.AddModelError(nameof(CreateAutoLeadRequest.AutoInsuranceAgencyId), "Auto insurance agency not found.");
        }

        if (verifierCompanyId.HasValue && !await _context.VerifierCompanies.AnyAsync(company => company.Id == verifierCompanyId.Value))
        {
            ModelState.AddModelError(nameof(CreateAutoLeadRequest.VerifierCompanyId), "Verifier company not found.");
        }

        var appUser = string.IsNullOrWhiteSpace(appUserId)
            ? null
            : await _context.Users.FirstOrDefaultAsync(user => user.Id == appUserId);

        if (appUser is null)
        {
            ModelState.AddModelError(nameof(CreateAutoLeadRequest.AppUserId), "App user not found.");
        }
        else if (appUser.AutoInsuranceAgencyId != agencyId)
        {
            ModelState.AddModelError(nameof(CreateAutoLeadRequest.AppUserId), "App user must belong to the selected agency.");
        }

        return ModelState.IsValid ? null : ValidationProblem(ModelState);
    }

    private async Task LoadReferences(AutoLead lead)
    {
        await _context.Entry(lead).Reference(item => item.AutoInsuranceAgency).LoadAsync();
        await _context.Entry(lead).Reference(item => item.VerifierCompany).LoadAsync();
        await _context.Entry(lead).Reference(item => item.AppUser).LoadAsync();
    }

    private static AutoLeadDto ToDto(AutoLead lead)
    {
        var userName = lead.AppUser is null
            ? string.Empty
            : $"{lead.AppUser.FirstName} {lead.AppUser.LastName}".Trim();

        return new AutoLeadDto(
            lead.Id,
            lead.RowId,
            lead.FirstName,
            lead.LastName,
            lead.Phone,
            lead.Email,
            lead.DateOfBirth,
            lead.AutoInsuranceAgencyId,
            lead.AutoInsuranceAgency?.Name ?? string.Empty,
            lead.VerifierCompanyId,
            lead.VerifierCompany?.Name ?? string.Empty,
            lead.AppUserId,
            userName);
    }
}
