using AToyStore.Application.Abstractions;
using AToyStore.Core.Models;
using AToyStore.Core.Abstractions;

namespace AToyStore.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Product> GetByIdAsync(Guid id)
    {
        return await _productRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _productRepository.GetAllAsync();
    }

    public async Task<Guid> AddAsync(Product product)
    {
        return await _productRepository.AddAsync(product);
    }

    public async Task<Guid> UpdateAsync(Guid id, Product product)
    {
        return await _productRepository.UpdateAsync(id, product.Name, product.Description, product.Price, product.StockQuantity, product.ImageUrl);
    }

    public async Task<Guid> DeleteAsync(Guid id)
    {
        return await _productRepository.DeleteAsync(id);
    }
}
