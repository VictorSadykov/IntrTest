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

        public CoinController(ICoinRepository coinRepository)
        {
            _coinRepository = coinRepository;
        }


        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var coins = await _coinRepository.GetAllAsync();

            return Ok(coins);
        }
    }
}
