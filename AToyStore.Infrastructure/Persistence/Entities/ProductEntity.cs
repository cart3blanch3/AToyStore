using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AToyStore.Infrastructure.Persistence.Entities;

[Table("Products")] 
public class ProductEntity
{
    [Key] 
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Название продукта обязательно")] 
    [MaxLength(100, ErrorMessage = "Длина названия не может превышать 100 символов")] 
    public string Name { get; set; }

    [MaxLength(500, ErrorMessage = "Длина описания не может превышать 500 символов")] 
    public string? Description { get; set; }

    [Column(TypeName = "decimal(18,2)")] 
    [Range(0.01, double.MaxValue, ErrorMessage = "Цена должна быть больше 0")] 
    public decimal Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Количество товара не может быть отрицательным")] 
    public int StockQuantity { get; set; }

    [Url(ErrorMessage = "Некорректный URL изображения")]
    public string? ImageUrl { get; set; }
}
