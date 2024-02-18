using AutoMapper;
using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;
using IntrTest.Data.Models.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IntrTest.Controllers
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
                var foundCoin = await _coinRepository.FindByValueAsync(coin.Value);
                foundCoin.Amount += coin.Amount;
                await _coinRepository.UpdateAsync(foundCoin);
            }

            var sum = 0;

            foreach (var coin in insertedCoins)
            {
                sum += coin.Value * coin.Amount;
            }

            foundUser.CurrentBalance += sum;
            await _userManager.UpdateAsync(foundUser);

            return Ok(ModelState);
        }

        [HttpPut("giveChange/{userId}")]
        public async Task<IActionResult> GiveChange([FromRoute] string userId)
        {
            var foundUser = await _userManager.FindByIdAsync(userId);

            if (foundUser == null)
            {
                ModelState.AddModelError("UserNotFound", "Пользователя с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var coins = await _coinRepository.GetAllAsync();

            coins.Sort((x, y) => y.Value.CompareTo(x.Value));

            var curBalance = foundUser.CurrentBalance;
            var coinsRemains = new Dictionary<int, int>();
            var coinsToGive = new Dictionary<int, int>();
            var changeInSum = 0;
            foreach (var coin in coins)
            {
                coinsRemains.Add(coin.Value, coin.Amount);
                coinsToGive.Add(coin.Value, 0);
            }

            foreach (var coin in coinsRemains)
            {
                int coinValue = coin.Key;
                int coinAmount = coin.Value;

                while (coinAmount > 0 && curBalance - coinValue >= 0)
                {
                    curBalance -= coinValue;
                    changeInSum += coinValue;
                    coinsRemains[coinValue]--;
                    coinsToGive[coinValue]++;

                    coinAmount--;

                    if (curBalance == 0)
                    {
                        break;
                    }
                }
            }

            foreach (var coin in coinsRemains)
            {
                var foundCoin = await _coinRepository.FindByValueAsync(coin.Key);
                foundCoin.Amount = coin.Value;
                await _coinRepository.UpdateAsync(foundCoin);
            }

            foundUser.CurrentBalance = curBalance;
            await _userManager.UpdateAsync(foundUser);

            List<InsertCoinsDTO> coinsOuted = new List<InsertCoinsDTO>();

            foreach (var coin in coinsToGive)
            {
                coinsOuted.Add(new InsertCoinsDTO()
                {
                    Value = coin.Key,
                    Amount = coin.Value,
                });
            }

            var resp = new CoinChangeDTO
            {
                CurrentUserBalance = curBalance,
                ChangeInSum = changeInSum,
                CoinsOuted = coinsOuted
            };

            return Ok(resp);
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
