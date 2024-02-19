using IntrTest.Data.Models.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class BoughtDrinksInfo
    {
        public decimal CurrentUserBalance { get; set; }
        public decimal TotalBuySum { get; set; }
        public List<BoughtDrinkItemInfo> UserDrinksBought { get; set; }
    }
}
