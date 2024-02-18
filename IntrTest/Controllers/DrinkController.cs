using AutoMapper;
using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;
using IntrTest.Data.Models.Repositories.Interfaces;
using IntrTest.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntrTest.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DrinkController : ControllerBase
    {
        private readonly IDrinkRepository _drinkRepository;
        private readonly IMapper _mapper;
        private readonly FileService _fileService;

        public DrinkController(IDrinkRepository? drinkRepository, IMapper? mapper, FileService? fileService)
        {
            _drinkRepository = drinkRepository;
            _mapper = mapper;
            _fileService = fileService;
        }

        [HttpGet("getAllDrinks")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var drinks = await _drinkRepository.GetAllAsync();

            return Ok(drinks);
        }

        [HttpPost("addDrink")]
        public async Task<IActionResult> Add([FromForm] AddDrinkDTO drink)
        {
            var drinkToAdd = _mapper.Map<Drink>(drink);
            drinkToAdd.ImageUrl = await _fileService.AddDrinkPhoto(drink.Photo);

            await _drinkRepository.AddAsync(drinkToAdd);

            return Ok();
        }

        [HttpGet("exportDrinks")]
        public async Task<IActionResult> ExportDrinks()
        {
            var drinks = await _drinkRepository.GetAllAsync();

            var file = await _fileService.ExportDrinks(drinks);
            return PhysicalFile(file.filePath, file.fileType, file.fileName);
        }

        [HttpPost("importDrinks")]
        public async Task<IActionResult> ImportDrinks([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Файл не выбран");
            }

            var drinks = await _fileService.GetDrinksFromFile(file);

            var imagePaths = drinks.Select(x => x.ImageUrl).ToList();

            await _fileService.UploadImagesFromFile(file, imagePaths);
            await _drinkRepository.AddRangeDrinks(drinks);

            return Ok(ModelState);
        }

        [HttpDelete("deleteDrink/{id}")]
        public async Task<IActionResult> DeleteDrinkById([FromRoute] int id)
        {
            var foundDrink = await _drinkRepository.GetByIdAsync(id);

            if (foundDrink == null)
            {
                ModelState.AddModelError("drinkNotFound", "Напитка с таким id нет в БД");
                return BadRequest(ModelState);
            }

            var isAnyDrinkUsesImageUrl = await _drinkRepository.IsManyDrinksUsesImageUrl(foundDrink.ImageUrl);

            if (!isAnyDrinkUsesImageUrl)
            {
                await _fileService.DeleteImage(foundDrink.ImageUrl);
            }

            await _drinkRepository.DeleteAsync(foundDrink);
            return Ok(ModelState);
        }

        [HttpPut("editDrink/{id}")]
        public async Task<IActionResult> EditDrink([FromRoute] int id, [FromForm] AddDrinkDTO drink)
        {
            var foundDrink = await _drinkRepository.GetByIdAsync(id);

            if (foundDrink == null)
            {
                ModelState.AddModelError("drinkNotFound", "Напитка с таким id нет в БД");
                return BadRequest(ModelState);
            }

            if (drink.Photo != null)
            {
                var isAnyDrinkUsesImageUrl = await _drinkRepository.IsManyDrinksUsesImageUrl(foundDrink.ImageUrl);

                if (!isAnyDrinkUsesImageUrl)
                {
                    await _fileService.DeleteImage(foundDrink.ImageUrl);
                }
            }

            var imageUrl = foundDrink.ImageUrl;

            // Обновляем свойства найденного напитка
            foundDrink.Name = drink.Name;
            foundDrink.Amount = drink.Amount;
            foundDrink.Price = drink.Price;

            if (drink.Photo != null)
            {
                foundDrink.ImageUrl = await _fileService.AddDrinkPhoto(drink.Photo);
            }
            else
            {
                foundDrink.ImageUrl = imageUrl;
            }

            await _drinkRepository.UpdateAsync(foundDrink);
            return Ok(ModelState);
        }

        [HttpGet("getPagedDrinks")]
        public async Task<IActionResult> GetPagedResults([FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var drinks = await _drinkRepository.GetAllAsync();

            var result = Paginator<Drink>.GetPaged(drinks, pageNumber, pageSize);
            return Ok(result);
        }
    }
}
