using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FindProLead.Api.Identity;

namespace FindProLead.Api.Features.Users;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = _userManager.Users.ToList();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            userDtos.Add(await ToDto(user));
        }

        return Ok(userDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(await ToDto(user));
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUserRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            VerifierCompanyId = request.VerifierCompanyId,
            AutoInsuranceAgencyId = request.AutoInsuranceAgencyId
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Count > 0)
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            await _userManager.AddToRoleAsync(user, request.Role);
        }

        var dto = await ToDto(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, dto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> Update(string id, UpdateUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.UserName = request.Email;
        user.VerifierCompanyId = request.VerifierCompanyId;
        user.AutoInsuranceAgencyId = request.AutoInsuranceAgencyId;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Count > 0)
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            await _userManager.AddToRoleAsync(user, request.Role);
        }

        return Ok(await ToDto(user));
    }

    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(string id, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        return NoContent();
    }

    private async Task<UserDto> ToDto(ApplicationUser user)
    {
        var isLocked = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow;
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();

        return new UserDto(user.Id, user.FirstName, user.LastName, user.Email!, user.UserName!, isLocked, user.VerifierCompanyId, user.AutoInsuranceAgencyId, role, user.CreatedOn);
    }
}
