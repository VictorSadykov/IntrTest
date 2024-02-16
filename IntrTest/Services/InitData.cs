using IntrTest.Const;
using IntrTest.Data.Models.Database;
using IntrTest.Extensions;
using Microsoft.AspNetCore.Identity;

namespace IntrTest.Services
{
    public static class InitData
    {
        public static async Task IdentityInitialiazer(IApplicationBuilder app)
        {
            using (var scope = app.ApplicationServices.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetService<UserManager<User>>();
                var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

                await CreateDefaultRoles(userManager, roleManager);
                await CreateDefaultUsers(userManager);
            }
        }

        private static async Task CreateDefaultRoles(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            var roles = new List<string>()
                {
                    Roles.ADMIN,
                    Roles.CUSTOMER
                };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var roleToCreate = new IdentityRole
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = role,
                    };

                    await roleManager.CreateAsync(roleToCreate);
                }
            }
        }

        private static async Task CreateDefaultUsers(UserManager<User> userManager)
        {
            var loginPasswords = new Dictionary<string, string>()
            {
                {DefaultUsers.ADMIN_LOGIN, DefaultUsers.ADMIN_PASSWORD },
                {DefaultUsers.CUSTOMER_LOGIN, DefaultUsers.CUSTOMER_PASSWORD },

            };

            foreach (var userInfo in loginPasswords)
            {
                if (await userManager.FindByNameAsync(userInfo.Key) == null)
                {
                    var user = new User
                    {
                        UserName = userInfo.Key,
                    };

                    await userManager.CreateAsync(user, userInfo.Value);
                    await userManager.AddToRoleAsync(user, Roles.CUSTOMER);
                }
            }

            var foundAdmin = await userManager.FindByNameAsync(DefaultUsers.ADMIN_LOGIN);

            await userManager.AddToRoleAsync(foundAdmin, Roles.ADMIN);
        }
    }
}
