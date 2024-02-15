using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class TokenValidationDTO
    {
        [Required]
        public string? AccessToken { get; set; }

        [Required]
        public string? RefreshToken { get; set; }
    }
}
