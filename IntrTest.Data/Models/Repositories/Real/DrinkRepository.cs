using IntrTest.Data.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Repositories.Real
{
    public class DrinkRepository
    {
        protected readonly PostgreContext _dbContext;

        public DrinkRepository(PostgreContext dbContext)
        {
            _dbContext = dbContext;
        }

        
    }
}
