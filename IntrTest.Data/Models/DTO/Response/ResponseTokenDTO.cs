﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Models.DTO.Response
{
    public class ResponseTokenDTO
    {
        public string UserId { get; set; }
        public string Login { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string Status { get; set; }
        public string Error { get; set; }
    }
}
