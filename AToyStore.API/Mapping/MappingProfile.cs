using AutoMapper;
using AToyStore.API.DTOs;
using AToyStore.Core.Models;
using System.Linq;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AToyStore.API.Mapping
{
    public class ApiMappingProfile : Profile
    {
        public ApiMappingProfile()
        {
            CreateMap<Product, ProductResponseDto>();
            CreateMap<ProductCreateDto, Product>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<IdentityUser, UserProfileDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.UserName)) 
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber));


            CreateMap<OrderCreateDto, Order>()
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore())
                .ConstructUsing(src => new Order(
                    src.CustomerName,
                    src.CustomerPhone,
                    src.Address,
                    src.Comment,
                    src.UserId
                ));

            CreateMap<OrderItemDto, OrderItem>()
                .ConstructUsing(src => new OrderItem(
                    default,
                    src.ProductId,
                    src.ProductName,
                    src.UnitPrice,
                    src.Quantity
                ));

            CreateMap<Order, OrderResponseDto>()
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.OrderItems.Sum(item => item.UnitPrice * item.Quantity)))
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName));
        }
    }
}
