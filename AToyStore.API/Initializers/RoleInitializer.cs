namespace AToyStore.API.Initializers
{
    using Microsoft.AspNetCore.Identity;

    namespace AToyStore.API.Initializers
    {
        public class RoleInitializer
        {
            public static async Task AddRoles(IServiceProvider serviceProvider)
            {
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

                string[] roleNames = { "Admin", "User" };
                IdentityResult roleResult;

                foreach (var roleName in roleNames)
                {
                    var roleExist = await roleManager.RoleExistsAsync(roleName);
                    if (!roleExist)
                    {
                        roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                    }
                }

                // Создаем администратора
                var adminUser = new IdentityUser
                {
                    UserName = "admin",
                    Email = "admin@example.com"
                };

                string adminPassword = "Admin123!";
                var admin = await userManager.FindByEmailAsync(adminUser.Email);

                if (admin == null)
                {
                    var createAdmin = await userManager.CreateAsync(adminUser, adminPassword);
                    if (createAdmin.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                    }
                }
            }
        }
    }
}
