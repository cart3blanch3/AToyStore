using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AToyStore.Infrastructure.Persistence.Entities
{
    [Table("OrderItems")]
    public class OrderItemEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid OrderId { get; set; }

        [ForeignKey(nameof(OrderId))]
        public OrderEntity Order { get; set; } = null!;

        [Required]
        public Guid ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public ProductEntity Product { get; set; } = null!;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Количество должно быть больше нуля")]
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Цена за единицу должна быть больше 0")]
        public decimal UnitPrice { get; set; }
    }
}
