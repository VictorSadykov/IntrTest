using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class CoinChangeDTO
    {
        public decimal ChangeInSum { get; set; }
        public decimal CurrentUserBalance { get; set;}
        public List<InsertCoinsDTO> CoinsOuted { get; set; }
    }
}
