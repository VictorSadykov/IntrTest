﻿using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;
using IntrTest.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace IntrTest.Controllers.Security
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;


        public AuthController(
            UserManager<User> userManager, 
            SignInManager<User> signInManager, 
            RoleManager<IdentityRole> roleManager, 
            IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("registerUser")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if ((await _userManager.FindByNameAsync(model.Login)) != null)
            {
                ModelState.AddModelError("regError", "Пользователь с таким логином уже существует");
                return BadRequest(ModelState);
            }

            User user = new User { UserName = model.Login };

            await _userManager.CreateAsync(user);
            await _userManager.AddPasswordAsync(user, model.Password);

            return Ok(ModelState);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.Login);

            if (user == null)
            {
                ModelState.AddModelError("loginError", "Неверное имя пользователя или пароль");
                return BadRequest(ModelState);
            }

            var jwtService = new JwtService(_config);
            var claims = await jwtService.GetClaimByUser(user, _userManager);

            var token = jwtService.CreateToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(15);

            await _userManager.UpdateAsync(user);

            return Ok(ModelState);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Test()
        {
            return Ok(123123);
        }
    }
}
