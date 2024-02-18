using IntrTest.Data.Models.Database;

namespace IntrTest.Data.Models.Repositories.Interfaces
{
    public interface IDrinkRepository
    {
        Task AddAsync(Drink drink);
        Task<List<Drink>> GetAllAsync();
        Task<Drink?> GetByIdAsync(int id);
        Task AddRangeDrinks(List<Drink> drinks);
        Task UpdateAsync(Drink drink);
        Task DeleteAsync(Drink drink);
        Task<bool> IsManyDrinksUsesImageUrl(string url);
    }
}