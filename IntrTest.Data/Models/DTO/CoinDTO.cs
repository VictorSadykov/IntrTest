using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class CoinDTO
    {
        public int Value { get; set; }
        public int Amount { get; set; }
        public bool IsBlocked { get; set; }
    }
}
