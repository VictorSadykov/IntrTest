using IntrTest.Data.Context;
using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Repositories.Real
{
    public class DrinkRepository : IDrinkRepository
    {
        protected readonly PostgreContext _dbContext;

        public DrinkRepository(PostgreContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Drink?> GetByIdAsync(int id)
        {
            return await _dbContext.Drinks.SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddRangeDrinks(List<Drink> drinks)
        {

            _dbContext.AddRange(drinks);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Drink>> GetAllAsync()
        {
            return await _dbContext.Drinks.ToListAsync();
        }

        public async Task UpdateAsync(Drink drink)
        {
            _dbContext.Drinks.Update(drink);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddAsync(Drink drink)
        {
            _dbContext.Drinks.Add(drink);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Drink drink)
        {
            _dbContext.Drinks.Remove(drink);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> IsManyDrinksUsesImageUrl(string url)
        {
           var drinks =  await _dbContext.Drinks.Where(x => x.ImageUrl == url).ToListAsync();
           return drinks.Count > 1 ? true : false;
        }

    }
}
