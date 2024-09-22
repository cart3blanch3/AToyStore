using AToyStore.Core.Models;

namespace AToyStore.Application.Abstractions
{
    public interface IOrderService
    {
        Task<Order> GetByIdAsync(Guid id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<Guid> AddAsync(Order order);
        Task<Guid> UpdateAsync(Guid id, Order order);
        Task<Guid> DeleteAsync(Guid id);
    }
}
