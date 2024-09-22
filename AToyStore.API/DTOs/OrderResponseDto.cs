namespace AToyStore.API.DTOs
{
    public class OrderResponseDto
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string Address { get; set; }
        public string? Comment { get; set; }
        public IEnumerable<OrderItemDto> OrderItems { get; set; }
    }
}
