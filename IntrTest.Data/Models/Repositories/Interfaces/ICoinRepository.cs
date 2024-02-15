using IntrTest.Data.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Repositories.Interfaces
{
    public interface ICoinRepository
    {
        Task<List<Coin>> GetAllAsync();
        Task UpdateAsync(Coin coin);
        Task<Coin?> FindByValueAsync(int value);
    }
}
