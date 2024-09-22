using AToyStore.Core.Models;

namespace AToyStore.Application.Abstractions
{
    public interface IProductService
    {
        Task<Product> GetByIdAsync(Guid id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Guid> AddAsync(Product product);
        Task<Guid> UpdateAsync(Guid id, Product product);
        Task<Guid> DeleteAsync(Guid id);
    }
}
