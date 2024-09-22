namespace AToyStore.Core.Models;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public string ImageUrl { get; private set; }

    public Product(string name, string description, decimal price, int stockQuantity, string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Название не может быть пустым.");
        if (price <= 0) throw new ArgumentException("Цена должна быть больше нуля.");
        if (stockQuantity < 0) throw new ArgumentException("Количество на складе не может быть отрицательным.");

        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        ImageUrl = imageUrl;
    }

    public void UpdateProductInfo(string name, string description, decimal price, string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Название не может быть пустым.");
        if (price <= 0) throw new ArgumentException("Цена должна быть больше нуля.");

        Name = name;
        Description = description;
        Price = price;
        ImageUrl = imageUrl;
    }

    public void DecreaseStock(int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Количество должно быть больше нуля.");
        if (StockQuantity < quantity) throw new InvalidOperationException("Недостаточно товара на складе.");
        StockQuantity -= quantity;
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Количество должно быть больше нуля.");
        StockQuantity += quantity;
    }
}
