using Microsoft.AspNetCore.Identity;
using FindProLead.Api.Identity;

namespace FindProLead.Api.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        var roles = new[] { "Admin", "Verifier Manager", "Agency Manager" };
        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        const string adminEmail = "admin@findprolead.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, "Admin@12345");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        else if (!await userManager.CheckPasswordAsync(adminUser, "Admin@12345"))
        {
            var resetToken = await userManager.GeneratePasswordResetTokenAsync(adminUser);
            var resetResult = await userManager.ResetPasswordAsync(adminUser, resetToken, "Admin@12345");
            if (!resetResult.Succeeded)
            {
                throw new InvalidOperationException("Could not synchronize the development Admin password.");
            }
        }

        var adminRoles = await userManager.GetRolesAsync(adminUser);
        if (!adminRoles.Contains("Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
