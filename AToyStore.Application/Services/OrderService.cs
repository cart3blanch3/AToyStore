using AToyStore.Application.Abstractions;
using AToyStore.Core.Models;
using AToyStore.Core.Abstractions;

namespace AToyStore.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Order> GetByIdAsync(Guid id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _orderRepository.GetOrdersByUserIdAsync(userId);
        }

        public async Task<Guid> AddAsync(Order order)
        {
            return await _orderRepository.AddAsync(order);
        }

        public async Task<Guid> UpdateAsync(Guid id, Order order)
        {
            return await _orderRepository.UpdateAsync(
                order
            );
        }

        public async Task<Guid> DeleteAsync(Guid id)
        {
            return await _orderRepository.DeleteAsync(id);
        }
    }
}
