using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class UserDrinkDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int DrinkId { get; set; }
        public int Amount { get; set; }
    }
}
