using Microsoft.AspNet.Identity.EntityFramework;

namespace AToyStore.Core.Models
{
    public class Order
    {
        public Guid Id { get; private set; }
        public DateTime OrderDate { get; private set; }
        public decimal TotalAmount { get; private set; }
        public string CustomerName { get; private set; }
        public string CustomerPhone { get; private set; }
        public string Address { get; private set; }
        public string? Comment { get; private set; }
        public string UserId { get; private set; }
        public IdentityUser? User { get; private set; }  

        private List<OrderItem> _orderItems = new List<OrderItem>();
        public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();

        public Order()
        {
        }

        public Order(string customerName, string customerPhone, string address, string? comment, string userId)
        {
            if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Идентификатор пользователя не может быть пустым.");
            if (string.IsNullOrWhiteSpace(customerName)) throw new ArgumentException("Имя не может быть пустым.");
            if (string.IsNullOrWhiteSpace(customerPhone)) throw new ArgumentException("Номер телефона не может быть пустым.");
            if (string.IsNullOrWhiteSpace(address)) throw new ArgumentException("Адрес не может быть пустым.");

            Id = Guid.NewGuid();
            OrderDate = DateTime.UtcNow;
            CustomerName = customerName;
            CustomerPhone = customerPhone;
            Address = address;
            Comment = comment;
            UserId = userId;
        }

        public void AddOrderItem(OrderItem orderItem)
        {
            if (orderItem == null) throw new ArgumentNullException(nameof(orderItem));
            if (_orderItems.Any(item => item.ProductId == orderItem.ProductId))
                throw new InvalidOperationException("Товар уже добавлен в заказ.");

            _orderItems.Add(orderItem);
            TotalAmount = CalculateTotalAmount();
        }

        private decimal CalculateTotalAmount()
        {
            return _orderItems.Sum(item => item.UnitPrice * item.Quantity);
        }

        public void UpdateOrder(string customerName, string customerPhone, string address, string? comment)
        {
            if (string.IsNullOrWhiteSpace(customerName)) throw new ArgumentException("Имя не может быть пустым.");
            if (string.IsNullOrWhiteSpace(customerPhone)) throw new ArgumentException("Номер телефона не может быть пустым.");
            if (string.IsNullOrWhiteSpace(address)) throw new ArgumentException("Адрес не может быть пустым.");

            CustomerName = customerName;
            CustomerPhone = customerPhone;
            Address = address;
            Comment = comment;
        }

        public void RemoveOrderItem(Guid productId)
        {
            var orderItem = _orderItems.FirstOrDefault(item => item.ProductId == productId);
            if (orderItem != null)
            {
                _orderItems.Remove(orderItem);
                TotalAmount = CalculateTotalAmount();
            }
            else
            {
                throw new InvalidOperationException("Товар не найден в заказе.");
            }
        }

        public void UpdateOrderItemQuantity(Guid productId, int newQuantity)
        {
            if (newQuantity <= 0)
            {
                RemoveOrderItem(productId);
                return;
            }

            var orderItem = _orderItems.FirstOrDefault(item => item.ProductId == productId);
            if (orderItem != null)
            {
                orderItem.UpdateQuantity(newQuantity);
                TotalAmount = CalculateTotalAmount();
            }
            else
            {
                throw new InvalidOperationException("Товар не найден в заказе.");
            }
        }
    }
}
