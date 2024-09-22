using AToyStore.API.DTOs;
using AToyStore.Application.Abstractions;
using AToyStore.Application.Interfaces;
using AToyStore.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace AToyStore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IEmailService emailService, IMapper mapper)
        {
            _orderService = orderService;
            _emailService = emailService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            var responseDto = _mapper.Map<OrderResponseDto>(order);
            return Ok(responseDto);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Only for admins
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            var response = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
            return Ok(response);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetOrdersByUserId(string userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            var response = _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] OrderCreateDto request)
        {
            var order = _mapper.Map<Order>(request);
            foreach (var item in request.OrderItems)
            {
                order.AddOrderItem(_mapper.Map<OrderItem>(item));
            }

            var orderId = await _orderService.AddAsync(order);

            // Create detailed message for the email
            var subject = "Новый заказ";
            var message = CreateOrderDetailsMessage(order, orderId);
            await _emailService.SendEmailAsync("sergei05037@gmail.com", subject, message);  

            return CreatedAtAction(nameof(GetById), new { id = orderId }, new { id = orderId });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] OrderUpdateDto request)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            // Update order properties
            order.UpdateOrder(
                request.CustomerName,
                request.CustomerPhone,
                request.Address,
                request.Comment
            );

            foreach (var item in request.OrderItems)
            {
                if (item.Quantity <= 0)
                {
                    order.RemoveOrderItem(item.ProductId);
                }
                else
                {
                    var existingItem = order.OrderItems.FirstOrDefault(i => i.ProductId == item.ProductId);
                    if (existingItem != null)
                    {
                        existingItem.UpdateQuantity(item.Quantity);
                    }
                    else
                    {
                        var newOrderItem = new OrderItem(order.Id, item.ProductId, item.ProductName, item.UnitPrice, item.Quantity);
                        order.AddOrderItem(newOrderItem);
                    }
                }
            }

            await _orderService.UpdateAsync(id, order);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _orderService.DeleteAsync(id);
            return NoContent();
        }

        private string CreateOrderDetailsMessage(Order order, Guid orderId)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Новый заказ с идентификатором {orderId} был успешно оформлен.");
            sb.AppendLine($"Дата заказа: {DateTime.Now:dd.MM.yyyy HH:mm:ss}");
            sb.AppendLine($"Имя клиента: {order.CustomerName}");
            sb.AppendLine($"Телефон клиента: {order.CustomerPhone}");
            sb.AppendLine($"Адрес доставки: {order.Address}");
            sb.AppendLine($"Комментарий: {order.Comment}");
            sb.AppendLine();
            sb.AppendLine("Детали заказа:");

            foreach (var item in order.OrderItems)
            {
                sb.AppendLine($"- Продукт: {item.ProductName}");
                sb.AppendLine($"  Количество: {item.Quantity}");
                sb.AppendLine($"  Цена за единицу: {item.UnitPrice} ₸");
                sb.AppendLine($"  Итоговая стоимость: {item.Quantity * item.UnitPrice} ₸");
                sb.AppendLine();
            }

            var totalAmount = order.OrderItems.Sum(item => item.Quantity * item.UnitPrice);
            sb.AppendLine($"Итоговая стоимость заказа: {totalAmount} ₸");

            sb.AppendLine();
            sb.AppendLine("Пожалуйста, свяжитесь с клиентом для подтверждения и уточнения деталей.");

            return sb.ToString();
        }
    }
}
