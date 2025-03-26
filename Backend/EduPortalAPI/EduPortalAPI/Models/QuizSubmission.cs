namespace EduPortalAPI.Models
{
    public class QuizSubmission
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string StudentEmail { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
