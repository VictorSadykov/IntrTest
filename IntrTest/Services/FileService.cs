using IntrTest.Data.Models.Database;
using Newtonsoft.Json;
using System.IO.Compression;

namespace IntrTest.Services
{
    public class FileService
    {
        private readonly IWebHostEnvironment _appEnvironment;

        public FileService(IWebHostEnvironment appEnvironment)
        {
            _appEnvironment = appEnvironment;
        }

        private const string UPLOADS_PATH = $"/uploads/drinks";
        private const string JSON_PATH = $"/json/drinks";
        private const string TEMP_PATH = $"temp";

        public async Task<string> AddDrinkPhoto(IFormFile photo)
        {
            string id = Guid.NewGuid().ToString();
            string fileName = photo.FileName;            
            string fileExtension = GetFileExtension(fileName); 

            string path = $"{UPLOADS_PATH}/{id}.{fileExtension}";
            if (!Directory.Exists($"{_appEnvironment.WebRootPath}" + UPLOADS_PATH))
            {
                Directory.CreateDirectory($"{_appEnvironment.WebRootPath}" + UPLOADS_PATH);
            }
            using (var fileStream = new FileStream(_appEnvironment.WebRootPath + path, FileMode.Create))
            {
                await photo.CopyToAsync(fileStream);                
            }
            

            return path;
        }

        public async Task<(string filePath, string fileType, string fileName)> ExportDrinks(List<Drink> drinks)
        {
            string serializeObj = JsonConvert.SerializeObject(drinks);
            var jsonPath = $"{_appEnvironment.WebRootPath}" + JSON_PATH + "/json.json";

            if(!Directory.Exists($"{_appEnvironment.WebRootPath}" + JSON_PATH))
            {
                Directory.CreateDirectory($"{_appEnvironment.WebRootPath}" + JSON_PATH);
            }

            using (StreamWriter sw = new StreamWriter(jsonPath))
            {
                await sw.WriteAsync(serializeObj);
            }


           

            var imagesFolder = $"{_appEnvironment.WebRootPath}" + UPLOADS_PATH;
            var zipPath = $"{_appEnvironment.WebRootPath}" + TEMP_PATH;

            using (var memoryStream = new MemoryStream())
            {
                using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    zipArchive.CreateEntryFromFile(jsonPath, "json.json");

                    foreach (var imageFile in Directory.GetFiles(imagesFolder))
                    {
                        zipArchive.CreateEntryFromFile(imageFile, Path.Combine(UPLOADS_PATH, Path.GetFileName(imageFile)));
                    }
                }

                using (var fileStream = new FileStream(zipPath, FileMode.Create))
                {
                    memoryStream.Seek(0, SeekOrigin.Begin);
                    await memoryStream.CopyToAsync(fileStream);
                }
            }

            string file_type = "application/zip";
            string file_name = "drinks.zip";

            return (zipPath, file_type, file_name);
        }

        public async Task<List<Drink>> GetDrinksFromFile(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {

                await file.CopyToAsync(memoryStream);
                using (var zipArchive = new ZipArchive(memoryStream))
                {

                    var jsonEntry = zipArchive.GetEntry("json.json");
                    if (jsonEntry != null)
                    {
                        using (var stream = jsonEntry.Open())
                        using (var reader = new StreamReader(stream))
                        {
                            var jsonString = await reader.ReadToEndAsync();
                            var drinks = JsonConvert.DeserializeObject<List<Drink>>(jsonString);
                            return drinks;
                        }
                    }
                    else
                    {
                        throw new ArgumentException("Нет файла json.json");
                    }
                }
            }
        }

        public async Task DeleteImage(string path)
        {
            string imgPath = $"{_appEnvironment.WebRootPath}/{path}";

            if (File.Exists(imgPath))
            {
                File.Delete(imgPath);
            }
        }

        public async Task UploadImagesFromFile(IFormFile file, List<string> imagePaths)
        {
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);

                using (var zipArchive = new ZipArchive(memoryStream))
                {
                    foreach (var entry in zipArchive.Entries)
                    {
                        if (entry.FullName.StartsWith(UPLOADS_PATH))
                        {
                            var extension = Path.GetExtension(entry.Name);
                            if (extension == ".jpg" || extension == ".png" || extension == ".gif")
                            {
                                var fileName = Path.GetFileName(entry.Name);
                                if (imagePaths.Contains($"{UPLOADS_PATH}/{fileName}"))
                                {
                                    //var imagePath = Path.Combine(_appEnvironment.WebRootPath, "images", fileName);
                                    string imagePath = $"{_appEnvironment.WebRootPath}/{UPLOADS_PATH}/{fileName}";
                                    if (!File.Exists(imagePath))
                                    {
                                        // Сохранение изображения
                                        using (var entryStream = entry.Open())
                                        using (var imageStream = new MemoryStream())
                                        {
                                            await entryStream.CopyToAsync(imageStream);
                                            File.WriteAllBytes(imagePath, imageStream.ToArray());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
       


        private string GetFileExtension(string fileName)
        {
            int lastIndex = fileName.LastIndexOf('.');
            if (lastIndex >= 0)
            {
                return fileName.Substring(lastIndex + 1);
            }
            return string.Empty;
        }

        
    }
}

