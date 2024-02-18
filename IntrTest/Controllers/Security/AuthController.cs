using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;
using IntrTest.Data.Models.DTO.Response;
using IntrTest.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace IntrTest.Controllers.Security
{
    [AllowAnonymous]
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.Login);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                ModelState.AddModelError("loginError", "Неверное имя пользователя или пароль");
                return BadRequest(ModelState);
            }
                        

            var jwtService = new JwtService(_config);
            (string accessToken, string refreshToken) = await jwtService.UpdateRefreshAccessToken(user, _userManager);

            return Ok(new ResponseTokenDTO
            {
                UserId = user.Id,
                Login = model.Login,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
            {
                ModelState.AddModelError("Logout Error", "Identity не найдена");
                return BadRequest(ModelState);
            }

            string username = identity.Name;

            if (string.IsNullOrEmpty(username))
            {
                ModelState.AddModelError("Logout Error", "Пустое имя");
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                ModelState.AddModelError("Logout Error", "Нет такого пользователя");
                return BadRequest(ModelState);
            }

            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);

            return Ok(ModelState);
           
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenValidationDTO tokenModel)
        {
            var jwtService = new JwtService(_config);
            var principal = jwtService.GetClaimDataFromToken(tokenModel.AccessToken);

            if (principal == null)
            {
                ModelState.AddModelError("Token error", "Неверный access token");
                return BadRequest(ModelState);
            }

            string username = principal.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshToken != tokenModel.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                ModelState.AddModelError("Token error", "Неверный access token");
                return BadRequest(ModelState);
            }

            (string accessToken, string refreshToken) = await jwtService.UpdateRefreshAccessToken(user, _userManager);

            return Ok(new ResponseTokenDTO
            {
                UserId = user.Id,
                Login = user.UserName,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
            });

        }
    }
}
