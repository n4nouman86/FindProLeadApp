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
    public ActionResult<IEnumerable<UserDto>> GetAll()
    {
        var users = _userManager.Users
            .Select(u => new UserDto(
                u.Id,
                u.FirstName,
                u.LastName,
                u.Email!,
                u.UserName!,
                u.LockoutEnd != null && u.LockoutEnd > DateTimeOffset.UtcNow,
                u.SubsidiaryId,
                u.VerifierId,
                u.ClientId,
                u.CreatedOn))
            .ToList();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(ToDto(user));
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
            SubsidiaryId = request.SubsidiaryId,
            VerifierId = request.VerifierId,
            ClientId = request.ClientId
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

        var dto = ToDto(user);
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
        user.SubsidiaryId = request.SubsidiaryId;
        user.VerifierId = request.VerifierId;
        user.ClientId = request.ClientId;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        return Ok(ToDto(user));
    }

    private static UserDto ToDto(ApplicationUser user)
    {
        var isLocked = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.UtcNow;
        return new UserDto(user.Id, user.FirstName, user.LastName, user.Email!, user.UserName!, isLocked, user.SubsidiaryId, user.VerifierId, user.ClientId, user.CreatedOn);
    }
}
