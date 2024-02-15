using IntrTest.Data.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.Database
{
    public class Coin
    {
        [Key]
        public int Value { get; set; }
        public bool isBlocked { get; set; }
        public int Amount { get; set; }

    }
}
