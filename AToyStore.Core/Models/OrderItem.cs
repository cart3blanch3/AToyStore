namespace AToyStore.Core.Models
{
    public class OrderItem
    {
        public Guid OrderId { get; private set; }  
        public Guid ProductId { get; private set; }
        public string ProductName { get; private set; }
        public decimal UnitPrice { get; private set; }
        public int Quantity { get; private set; }

        public OrderItem(Guid orderId, Guid productId, string productName, decimal unitPrice, int quantity)
        {
            if (unitPrice <= 0) throw new ArgumentException("Цена товара должна быть больше нуля.");
            if (quantity <= 0) throw new ArgumentException("Количество товара должно быть больше нуля.");

            OrderId = orderId;
            ProductId = productId;
            ProductName = productName;
            UnitPrice = unitPrice;
            Quantity = quantity;
        }

        public void UpdateQuantity(int newQuantity)
        {
            if (newQuantity <= 0) throw new ArgumentException("Количество товара должно быть больше нуля.");
            Quantity = newQuantity;
        }
    }
}
