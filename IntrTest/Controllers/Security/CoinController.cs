using AutoMapper;
using IntrTest.Data.Models.DTO;
using IntrTest.Data.Models.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntrTest.Controllers.Security
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CoinController : ControllerBase
    {
        private readonly ICoinRepository _coinRepository;
        private readonly IMapper _mapper;

        public CoinController(ICoinRepository coinRepository, IMapper mapper)
        {
            _coinRepository = coinRepository;
            _mapper = mapper;
        }


        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var coins = await _coinRepository.GetAllAsync();

            return Ok(coins);
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
    }
}
