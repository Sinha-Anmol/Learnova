namespace EduPortalAPI.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string? PdfUrl { get; set; }
        public string UploadedBy { get; set; } = string.Empty;
    }
}
