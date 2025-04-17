// Controllers/PaymentController.cs
using EduPortalAPI.Data;
using EduPortalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Stripe;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public PaymentController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("create-payment-intent")]
    public async Task<ActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest request)
    {
        try
        {
            // Get user ID from email
            var userId = await GetUserIdByEmail(request.Email);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User not found");
            }

            // Create payment intent with Stripe
            var stripeSecretKey = _configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = stripeSecretKey;

            var options = new PaymentIntentCreateOptions
            {
                Amount = 1999, // $19.99 in cents
                Currency = "usd",
                Metadata = new Dictionary<string, string>
                {
                    { "userId", userId },
                    { "email", request.Email }
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return Ok(new { clientSecret = paymentIntent.ClientSecret });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPost("save-payment")]
    public async Task<ActionResult> SavePayment([FromBody] PaymentResultRequest request)
    {
        try
        {
            if (request.PaymentStatus != "succeeded")
            {
                return BadRequest("Payment not completed");
            }

            var payment = new PremiumPayment
            {
                UserId = request.UserId,
                PaymentId = request.PaymentId,
                PaymentDateTime = DateTime.UtcNow,
                Amount = request.Amount,
                Status = request.PaymentStatus
            };

            _context.PremiumPayments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    private async Task<string> GetUserIdByEmail(string email)
    {
        // Call your existing API to get user ID
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync($"https://learnova-production.up.railway.app/api/Analytics/GetUserIdByEmail?email={Uri.EscapeDataString(email)}");

        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        return null;
    }
}

public class PaymentIntentRequest
{
    public string Email { get; set; }
}

public class PaymentResultRequest
{
    public string UserId { get; set; }
    public string PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentStatus { get; set; }
}