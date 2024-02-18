using IntrTest.Data.Models.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntrTest.Controllers.Security
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UserController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("getCurrentBalance/{userId}")]
        public async Task<IActionResult> GetCurrentBalance([FromRoute] string userId)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            return Ok(foundUser.CurrentBalance);
        }
    }
}
