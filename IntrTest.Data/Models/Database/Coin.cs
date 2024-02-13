using IntrTest.Data.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Database
{
    public class Coin : IEntityBase<int>
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public bool isBlocked { get; set; }
        public int Amount { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
