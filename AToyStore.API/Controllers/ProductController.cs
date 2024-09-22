using AToyStore.API.DTOs;
using AToyStore.Application.Abstractions;
using AToyStore.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;

namespace AToyStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductsController(IProductService productService, IMapper mapper)
        {
            _productService = productService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var responseDto = _mapper.Map<ProductResponseDto>(product);
            return Ok(responseDto);
        }

        [HttpGet]
        [AllowAnonymous] 
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            var response = _mapper.Map<IEnumerable<ProductResponseDto>>(products);
            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> Add([FromBody] ProductCreateDto request)
        {
            var product = _mapper.Map<Product>(request);
            var productId = await _productService.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = productId }, new { id = productId });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductUpdateDto request)
        {
            var existingProduct = await _productService.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            var product = _mapper.Map<Product>(request);
            await _productService.UpdateAsync(id, product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> Delete(Guid id)
        {
            await _productService.DeleteAsync(id);
            return NoContent();
        }
    }
}
