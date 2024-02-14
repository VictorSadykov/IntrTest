using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Не указано имя пользователя")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Не указан пароль")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Не указан повтор пароля")]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string PasswordReply { get; set; }
    }
}
