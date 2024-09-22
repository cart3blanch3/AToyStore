using AToyStore.Core.Models;

namespace AToyStore.Core.Abstractions
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(Guid id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Guid> AddAsync(Product product);
        Task<Guid> UpdateAsync(Guid id, string name, string description, decimal price, int stockQuantity, string imageUrl);
        Task<Guid> DeleteAsync(Guid id);
    }
}
