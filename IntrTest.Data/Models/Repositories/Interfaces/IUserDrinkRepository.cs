using IntrTest.Data.Models.Database;

namespace IntrTest.Data.Models.Repositories.Real
{
    public interface IUserDrinkRepository
    {
        Task AddAsync(UserDrink userDrink);
        Task DeleteAsync(UserDrink userDrink);
        Task<List<UserDrink>> GetAllAsync();
        Task UpdateAsync(UserDrink userDrink);

        Task<UserDrink?> GetByIdAsync(string userId, int drinkId);
        Task<List<UserDrink>> GetAllUserDrinks(string userId);
    }
}