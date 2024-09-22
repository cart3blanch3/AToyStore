using AutoMapper;
using AToyStore.Core.Abstractions;
using AToyStore.Core.Models;
using AToyStore.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace AToyStore.Infrastructure.Persistence.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Order> GetByIdAsync(Guid id)
        {
            var entity = await _context.Orders
                .AsNoTracking()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product) 
                .FirstOrDefaultAsync(o => o.Id == id);

            return _mapper.Map<Order>(entity);
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            var entities = await _context.Orders
                .AsNoTracking()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product) 
                .ToListAsync();

            return _mapper.Map<IEnumerable<Order>>(entities);
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            var entities = await _context.Orders
                .AsNoTracking()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<Order>>(entities);
        }

        public async Task<Guid> AddAsync(Order order)
        {
            var entity = _mapper.Map<OrderEntity>(order);
            await _context.Orders.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<Guid> UpdateAsync(Order order)
        {
            var existingOrder = await _context.Orders
                .Include(o => o.OrderItems) 
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (existingOrder == null)
            {
                throw new InvalidOperationException("Заказ не найден.");
            }

            existingOrder.CustomerName = order.CustomerName;
            existingOrder.CustomerPhone = order.CustomerPhone;
            existingOrder.Address = order.Address;
            existingOrder.TotalAmount = order.TotalAmount;
            existingOrder.Comment = order.Comment;

            existingOrder.OrderItems.Clear(); 

            foreach (var item in order.OrderItems)
            {
                existingOrder.OrderItems.Add(new OrderItemEntity
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                });
            }

            await _context.SaveChangesAsync();

            return existingOrder.Id;
        }


        public async Task<Guid> DeleteAsync(Guid id)
        {
            var entity = await _context.Orders
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);

            if (entity == null)
            {
                throw new InvalidOperationException("Заказ не найден.");
            }

            _context.Orders.Remove(entity);
            await _context.SaveChangesAsync();
            return id;
        }
    }
}
