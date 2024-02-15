using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO.Responce
{
    public class ResponseDTO
    {
        public int Status { get; set; }
        public bool isSuccess { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
