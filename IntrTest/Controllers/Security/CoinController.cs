using AutoMapper;
using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;
using IntrTest.Data.Models.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntrTest.Controllers.Security
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CoinController : ControllerBase
    {
        private readonly ICoinRepository _coinRepository;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public CoinController(ICoinRepository coinRepository, IMapper mapper, UserManager<User>? userManager)
        {
            _coinRepository = coinRepository;
            _mapper = mapper;
            _userManager = userManager;
        }


        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var coins = await _coinRepository.GetAllAsync();

            return Ok(coins);
        }

        [HttpPut("insertCoins/{userId}")]
        public async Task<IActionResult> InsertCoins([FromRoute] string userId, [FromBody] List<InsertCoinsDTO> insertedCoins)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            foreach (var coin in insertedCoins)
            {

            }

            var sum = 0;

            foreach (var coin in insertedCoins)
            {
                sum += coin.Value * coin.Amount;
            }

            foundUser.CurrentBalance += sum;
            await _userManager.UpdateAsync(foundUser);
        }

        [HttpPut("updateCoinByValue/{value}")]
        public async Task<IActionResult> UpdateCoinByValue([FromRoute] int value, [FromBody] CoinDTO coin)
        {
            var foundCoin = await _coinRepository.FindByValueAsync(value);

            if (foundCoin == null)
            {
                ModelState.AddModelError("CoinNotFound", "Такой монеты нет в базе данных.");
                return BadRequest(ModelState);
            }

            foundCoin.Amount = coin.Amount;
            foundCoin.isBlocked = coin.IsBlocked;
            
            await _coinRepository.UpdateAsync(foundCoin);
            return Ok(foundCoin);
        }

        [HttpPut("updateCoins")]
        public async Task<IActionResult> UpdateCoins([FromBody] CoinDTO[] coins)
        {
            foreach (var coin in coins)
            {
                var foundCoin = await _coinRepository.FindByValueAsync(coin.Value);

                if (foundCoin == null)
                {
                    ModelState.AddModelError("CoinNotFound", "Такой монеты нет в базе данных.");
                    return BadRequest(ModelState);
                }

                foundCoin.Amount = coin.Amount;
                foundCoin.isBlocked = coin.IsBlocked;

                await _coinRepository.UpdateAsync(foundCoin);
            }

            return Ok(ModelState);
        }
    }
}
