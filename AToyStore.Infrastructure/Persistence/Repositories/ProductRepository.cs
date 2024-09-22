using AutoMapper;
using AToyStore.Core.Abstractions;
using AToyStore.Core.Models;
using AToyStore.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace AToyStore.Infrastructure.Persistence.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProductRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Product> GetByIdAsync(Guid id)
        {
            var entity = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            return _mapper.Map<Product>(entity);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            var entities = await _context.Products
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<IEnumerable<Product>>(entities);
        }

        public async Task<Guid> AddAsync(Product product)
        {
            var entity = _mapper.Map<ProductEntity>(product);
            await _context.Products.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity.Id; 
        }

        public async Task<Guid> UpdateAsync(Guid id, string name, string description, decimal price, int stockQuantity, string imageUrl)
        {
            await _context.Products
                .Where(p => p.Id == id)
                .ExecuteUpdateAsync(set => set
                    .SetProperty(p => p.Name, name)
                    .SetProperty(p => p.Description, description)
                    .SetProperty(p => p.Price, price)
                    .SetProperty(p => p.StockQuantity, stockQuantity)
                    .SetProperty(p => p.ImageUrl, imageUrl));
            return id;
        }

        public async Task<Guid> DeleteAsync(Guid id)
        {
            var entity = await _context.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
            {
                throw new InvalidOperationException("Продукт не найден.");
            }

            _context.Products.Remove(entity);
            await _context.SaveChangesAsync();
            return id; 
        }
    }
}
