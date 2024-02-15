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
    public class CoinRepository : ICoinRepository
    {
        private readonly PostgreContext _dbContext;

        public CoinRepository(PostgreContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Coin>> GetAllAsync()
        {
            return await _dbContext.Coins.ToListAsync();
        }
    }
}
