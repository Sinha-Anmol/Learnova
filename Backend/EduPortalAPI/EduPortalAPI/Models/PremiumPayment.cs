namespace EduPortalAPI.Models
{
    // Models/PremiumPayment.cs
    public class PremiumPayment
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string PaymentId { get; set; }
        public DateTime PaymentDateTime { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
    }
}