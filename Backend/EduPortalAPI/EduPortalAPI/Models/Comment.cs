namespace EduPortalAPI.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string StudentEmail { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
