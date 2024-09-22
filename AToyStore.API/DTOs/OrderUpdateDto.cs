using System.ComponentModel.DataAnnotations;

namespace AToyStore.API.DTOs
{
    public class OrderUpdateDto
    {
        [Required]
        public string CustomerName { get; set; }

        [Required]
        public string CustomerPhone { get; set; }

        [Required]
        public string Address { get; set; }

        public string? Comment { get; set; }

        public List<OrderItemDto> OrderItems { get; set; } 
    }
}
