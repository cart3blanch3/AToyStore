using AToyStore.API.DTOs;

public class UserProfileDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public IEnumerable<OrderResponseDto> Orders { get; set; }
}
