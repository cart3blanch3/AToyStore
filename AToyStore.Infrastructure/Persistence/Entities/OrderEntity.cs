using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace AToyStore.Infrastructure.Persistence.Entities
{
    [Table("Orders")]
    public class OrderEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Сумма заказа должна быть больше 0")]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(100, ErrorMessage = "Имя клиента не может превышать 100 символов")]
        public string CustomerName { get; set; }

        [Required]
        [MaxLength(15, ErrorMessage = "Номер телефона не может превышать 15 символов")]
        public string CustomerPhone { get; set; }

        [Required]
        [MaxLength(500, ErrorMessage = "Адрес не может превышать 500 символов")]
        public string Address { get; set; }

        [MaxLength(1000, ErrorMessage = "Комментарий не может превышать 1000 символов")]
        public string? Comment { get; set; }

        [Required]
        [MaxLength(450, ErrorMessage = "Идентификатор пользователя не может превышать 450 символов")]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public IdentityUser User { get; set; }  

        public ICollection<OrderItemEntity> OrderItems { get; set; } = new List<OrderItemEntity>();
    }
}
