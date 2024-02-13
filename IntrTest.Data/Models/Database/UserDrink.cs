using IntrTest.Data.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Database
{
    public class UserDrink : IEntityBase<int>
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int DrinkId { get; set; }
        public Drink Coin { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
