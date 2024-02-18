using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class AddDrinkDTO
    {
        [Required(ErrorMessage = "Не указан Name напитка")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Не указан Amount напитка")]
        public int Amount { get; set; }

        [Required(ErrorMessage = "Не указан Price напитка")]
        public decimal Price { get; set; }

        public IFormFile? Photo { get; set; }
    }
}
