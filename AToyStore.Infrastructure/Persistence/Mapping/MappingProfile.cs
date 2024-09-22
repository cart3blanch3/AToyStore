using AutoMapper;
using AToyStore.Core.Models;
using AToyStore.Infrastructure.Persistence.Entities;

namespace AToyStore.Infrastructure.Persistence.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.StockQuantity))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));

            CreateMap<ProductEntity, Product>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.StockQuantity))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl));

            CreateMap<OrderEntity, Order>()
                .ForMember(dest => dest.OrderItems, opt => opt.Ignore()) 
                .AfterMap((src, dest) =>
                {
                    foreach (var item in src.OrderItems)
                    {
                        var orderItem = new OrderItem(item.OrderId, item.ProductId, item.Product.Name, item.UnitPrice, item.Quantity);
                        dest.AddOrderItem(orderItem);
                    }
                });

            CreateMap<OrderItemEntity, OrderItem>();
            CreateMap<Order, OrderEntity>();
            CreateMap<OrderItem, OrderItemEntity>();
            CreateMap<OrderItemEntity, OrderItem>();
        }
    }
}
