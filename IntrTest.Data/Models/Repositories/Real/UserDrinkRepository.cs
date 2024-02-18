using IntrTest.Data.Context;
using IntrTest.Data.Models.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Repositories.Real
{
    public class UserDrinkRepository : IUserDrinkRepository
    {
        private readonly PostgreContext _dbContext;

        public UserDrinkRepository(PostgreContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UserDrink?> GetByIdAsync(string userId, int drinkId)
        {
            return await _dbContext.UserDrinks.SingleOrDefaultAsync(x => x.UserId == userId && x.DrinkId == drinkId);
        }

        public async Task<List<UserDrink>> GetAllAsync()
        {
            return await _dbContext.UserDrinks.ToListAsync();
        }

        public async Task<List<UserDrink>> GetAllUserDrinks(string userId)
        {
            return await _dbContext.UserDrinks.Where(x => x.UserId == userId).ToListAsync();
        }

        public async Task AddAsync(UserDrink userDrink)
        {
            _dbContext.UserDrinks.Add(userDrink);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserDrink userDrink)
        {
            _dbContext.UserDrinks.Update(userDrink);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(UserDrink userDrink)
        {
            _dbContext.UserDrinks.Remove(userDrink);
            await _dbContext.SaveChangesAsync();
        }

    }
}
