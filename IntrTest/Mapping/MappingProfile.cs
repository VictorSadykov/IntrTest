using AutoMapper;
using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.DTO;

namespace IntrTest.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Coin, CoinDTO>().ReverseMap();
            CreateMap<AddDrinkDTO, Drink>().ReverseMap();
            CreateMap<UserDrink, UserDrinkDTO>().ReverseMap();
        }
    }
}
