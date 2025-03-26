namespace EduPortalAPI.Models
{
    public class CommentReply
    {
        public int Id { get; set; }
        public int CommentId { get; set; }
        public string TeacherEmail { get; set; } = string.Empty;
        public string Reply { get; set; } = string.Empty;
        public DateTime RepliedAt { get; set; } = DateTime.UtcNow;
    }
}
