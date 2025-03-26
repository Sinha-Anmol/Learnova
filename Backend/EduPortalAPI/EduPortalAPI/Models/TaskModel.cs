namespace EduPortalAPI.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        public string StudentEmail { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; } = false;
    }
}
