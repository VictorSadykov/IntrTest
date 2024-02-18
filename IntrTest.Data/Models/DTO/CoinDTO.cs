using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class CoinDTO
    {
        [Required(ErrorMessage = "Не указана ценность монеты")]
        public int Value { get; set; }

        [Required(ErrorMessage = "Не указано количество монет")]
        public int Amount { get; set; }

        [Required(ErrorMessage = "Не указана блокировка монеты")]
        public bool IsBlocked { get; set; }
    }
}
