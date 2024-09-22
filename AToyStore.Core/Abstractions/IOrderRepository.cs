using AToyStore.Core.Models;

namespace AToyStore.Core.Abstractions
{
    public interface IOrderRepository
    {
        Task<Guid> AddAsync(Order order);
        Task<Guid> DeleteAsync(Guid id);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order> GetByIdAsync(Guid id);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<Guid> UpdateAsync(Order order);
    }
}