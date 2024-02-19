using AutoMapper;
using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;
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
        private readonly IMapper _mapper;

        public UserDrinkController(IDrinkRepository drinkRepository, UserManager<User> userManager, IUserDrinkRepository userDrinkRepository, IMapper mapper)
        {
            _drinkRepository = drinkRepository;
            _userManager = userManager;
            _userDrinkRepository = userDrinkRepository;
            _mapper = mapper;
        }

        [HttpPut("buyDrinks/{userId}")]
        public async Task<IActionResult> BuyDrinks([FromRoute] string userId, [FromBody] List<UserDrinkDTO> userDrinks)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);
            var userDrinksMapped = _mapper.Map<List<UserDrink>>(userDrinks);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            foreach (var item in userDrinksMapped)
            {
                var foundUserDrink = await _userDrinkRepository.GetByIdAsync(userId, item.DrinkId);

                if (foundUserDrink == null)
                {
                    ModelState.AddModelError("UserDrinkNotFound", "Такого напитка пользователя нет в БД");
                    return BadRequest(ModelState);
                }
            }

            decimal totalSum = 0;

            foreach (var item in userDrinksMapped)
            {
                var foundDrink = await _drinkRepository.GetByIdAsync(item.DrinkId);

                if (foundDrink == null)
                {                    
                    ModelState.AddModelError("DrinkNotFound", "Такого напитка  нет в БД");
                    return BadRequest(ModelState);
                    
                }

                totalSum += foundDrink.Price * item.Amount;
            }

            if (totalSum > foundUser.CurrentBalance)
            {
                ModelState.AddModelError("NotEnoughMoney", "Не достаточно денег на счету");
                return BadRequest(ModelState);
            }

            var boughtDrinkItemInfoList = new List<BoughtDrinkItemInfo>();
            foreach (var item in userDrinksMapped)
            {

                var foundUserDrink = await _userDrinkRepository.GetByIdAsync(userId, item.DrinkId);
                if (foundUserDrink == null)
                {
                    ModelState.AddModelError("UserDrinkNotFound", "Такого напитка пользователя нет в БД");
                    return BadRequest(ModelState);
                }
                await _userDrinkRepository.DeleteAsync(foundUserDrink);


                var foundDrink = await _drinkRepository.GetByIdAsync(item.DrinkId);
                foundDrink.Amount -= item.Amount;

                if (foundDrink.Amount < 0)
                {
                    ModelState.AddModelError("NotEnoughDrinks", "Недостаточное количество напитков");
                    return BadRequest(ModelState);
                }

                if (foundDrink.Amount == 0)
                {
                    await _drinkRepository.DeleteAsync(foundDrink);
                }

                if (foundDrink.Amount > 0)
                {
                    foundDrink.Amount -= item.Amount;
                    await _drinkRepository.UpdateAsync(foundDrink);
                }

                boughtDrinkItemInfoList.Add(new BoughtDrinkItemInfo
                {
                    Name = foundDrink.Name,
                    Price = foundDrink.Price,
                    Amount = item.Amount,
                    TotalPrice = item.Amount * foundDrink.Price
                });



            }

            foundUser.CurrentBalance -= totalSum;
            await _userManager.UpdateAsync(foundUser);


            var boughtDrinksInfo = new BoughtDrinksInfo()
            {
                CurrentUserBalance = foundUser.CurrentBalance,
                TotalBuySum = totalSum,
                UserDrinksBought = boughtDrinkItemInfoList
            };

            return Ok(boughtDrinksInfo);
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
            var userDrinksMapped = _mapper.Map<List<UserDrinkDTO>>(userDrinks);
            return Ok(userDrinksMapped);
        }

        [HttpGet("getSpecificUserDrink/{userId}/{drinkId}")]
        public async Task<IActionResult> GetUserDrink([FromRoute] string userId, [FromRoute] int drinkId)
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



            var userDrink = await _userDrinkRepository.GetByIdAsync(userId, drinkId);
            var userDrinkMapped = _mapper.Map<UserDrinkDTO>(userDrink);
            userDrinkMapped.Amount = 1;
            return Ok(userDrinkMapped);
        }

        [HttpPatch("changeUserDrinkAmount/{userId}/{drinkId}")]
        public async Task<IActionResult> ChangeUserDrinkAmount([FromRoute] string userId, [FromRoute] int drinkId, [FromBody] int newAmount)
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

        [HttpDelete("deleteUserDrink/{userId}/{drinkId}")]
        public async Task<IActionResult> DeleteUserDrink([FromRoute] string userId, [FromRoute] int drinkId)
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


        [HttpPost("addDrinkToBasket/{userId}/{drinkId}")]
        public async Task<IActionResult> AddUserDrink([FromRoute] string userId, [FromRoute] int drinkId)
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
