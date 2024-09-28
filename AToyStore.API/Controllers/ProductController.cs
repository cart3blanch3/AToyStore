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
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ProductsController(IProductService productService, IMapper mapper, IWebHostEnvironment hostingEnvironment)
        {
            _productService = productService;
            _mapper = mapper;
            _hostingEnvironment = hostingEnvironment;
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
        public async Task<IActionResult> Add([FromForm] ProductCreateDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string imageUrl = null; 

            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images");
            if (request.Image != null && request.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.Image.FileName); 
                var filePath = Path.Combine(imagePath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Image.CopyToAsync(fileStream);
                }

                imageUrl = "/images/" + fileName; 
            }

            var product = new Product(request.Name, request.Description, request.Price, 0, imageUrl);
            await _productService.AddAsync(product);

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromForm] ProductUpdateDto request)
        {
            var existingProduct = await _productService.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            string imageUrl = existingProduct.ImageUrl;

            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images");
            if (request.Image != null && request.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.Image.FileName);
                var filePath = Path.Combine(imagePath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Image.CopyToAsync(fileStream);
                }

                imageUrl = "/images/" + fileName;
            }

            existingProduct.UpdateProductInfo(request.Name, request.Description, request.Price, imageUrl);

            await _productService.UpdateAsync(id, existingProduct);

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
