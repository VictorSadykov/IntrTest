using IntrTest.Data.Models.Repositories.Interfaces;
using IntrTest.Data.Models.Repositories.Real;

namespace IntrTest.Extensions
{
    public static class BuilderExtensions
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddTransient<ICoinRepository, CoinRepository>();
            services.AddTransient<IDrinkRepository, DrinkRepository>();
        }
    }
}
