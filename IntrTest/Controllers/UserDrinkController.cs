using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.Repositories.Interfaces;
using IntrTest.Data.Models.Repositories.Real;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntrTest.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserDrinkController : ControllerBase
    {
        private readonly IDrinkRepository _drinkRepository;
        private readonly IUserDrinkRepository _userDrinkRepository;
        private readonly UserManager<User> _userManager;

        public UserDrinkController(IDrinkRepository drinkRepository, UserManager<User> userManager, IUserDrinkRepository userDrinkRepository)
        {
            _drinkRepository = drinkRepository;
            _userManager = userManager;
            _userDrinkRepository = userDrinkRepository;
        }

        [HttpGet("getAllUserDrinks/{userId}")]
        public async Task<IActionResult> GetAllUserDrinks([FromRoute] string userId)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var userDrinks = await _userDrinkRepository.GetAllUserDrinks(userId);

            return Ok(userDrinks);
        }

        [HttpPatch("changeUserDrinkAmount/{userId}")]
        public async Task<IActionResult> ChangeUserDrinkAmount([FromRoute] string userId, [FromBody] int drinkId, [FromBody] int newAmount)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var foundDrink = await _drinkRepository.GetByIdAsync(drinkId);

            if (foundDrink == null)
            {
                ModelState.AddModelError("DrinkNotFound", "Напитка с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var foundUserDrink = await _userDrinkRepository.GetByIdAsync(userId, drinkId);

            if(foundUserDrink == null)
            {
                ModelState.AddModelError("UserDrinkNotFound", "Такого напитка пользователя нет в БД");
                return BadRequest(ModelState);
            }
            else
            {
                foundUserDrink.Amount = newAmount;
                await _userDrinkRepository.UpdateAsync(foundUserDrink);
            }

            return Ok(ModelState);
        }

        [HttpDelete("deleteUserDrink/{userId}")]
        public async Task<IActionResult> DeleteUserDrink([FromRoute] string userId, [FromBody] int drinkId)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var foundDrink = await _drinkRepository.GetByIdAsync(drinkId);

            if (foundDrink == null)
            {
                ModelState.AddModelError("DrinkNotFound", "Напитка с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var foundUserDrink = await _userDrinkRepository.GetByIdAsync(userId, drinkId);

            if (foundUserDrink == null)
            {
                ModelState.AddModelError("UserDrinkNotFound", "Такого напитка пользователя нет в БД");
                return BadRequest(ModelState);
            } 
            else
            {
                await _userDrinkRepository.DeleteAsync(foundUserDrink);
            }
            return Ok(ModelState);
        }


        [HttpPost("addDrinkToBasket/{userId}")]
        public async Task<IActionResult> AddUserDrink([FromRoute] string userId, [FromBody] int drinkId)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var foundDrink = await _drinkRepository.GetByIdAsync(drinkId);

            if (foundDrink == null)
            {
                ModelState.AddModelError("DrinkNotFound", "Напитка с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var foundUserDrink = await _userDrinkRepository.GetByIdAsync(userId, drinkId);

            if (foundUserDrink == null)
            {
                var newUserDrink = new UserDrink()
                {
                    Amount = 1, 
                    UserId = userId,
                    DrinkId = drinkId,
                };

                await _userDrinkRepository.AddAsync(newUserDrink);
            } 
            else
            {
                foundUserDrink.Amount++;
                await _userDrinkRepository.UpdateAsync(foundUserDrink);
            }

            return Ok(ModelState);
        }
    }
}
