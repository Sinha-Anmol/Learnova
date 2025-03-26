namespace EduPortalAPI.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Question { get; set; } = string.Empty;
        public string[] Options { get; set; } = new string[4];
        public string CorrectAnswer { get; set; } = string.Empty;
    }
}
