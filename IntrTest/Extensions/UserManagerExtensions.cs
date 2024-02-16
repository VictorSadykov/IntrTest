using IntrTest.Data.Models.Database;
using Microsoft.AspNetCore.Identity;

namespace IntrTest.Extensions
{
    public static class UserManagerExtensions
    {
        public static async void CreateIfNoExists(this UserManager<User> userManager, string login, string password)
        {
            var foundUser = await userManager.FindByNameAsync(login);
            if (foundUser != null) return;

            var user = new User
            {
                UserName = login,
            };

            await userManager.CreateAsync(user, password);
        }
    }
}
