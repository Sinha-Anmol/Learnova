using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EduPortalAPI.Models
{
    public class LearnovaCourse
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public string KeyTopics { get; set; }

        [Required]
        public string Domain { get; set; }

        [Required]
        public string Level { get; set; }

        public string TeacherEmail { get; set; }

        public string UID { get; set; }  // e.g., 8-digit + first name

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public ICollection<LearnovaCourseVideo> Videos { get; set; }
    }

    public class LearnovaCourseVideo
    {
        [Key]
        public int VideoId { get; set; }

        public string FileUrl { get; set; }

        public string FileName { get; set; }

        public string ContentType { get; set; }

        [ForeignKey("LearnovaCourse")]
        public int CourseId { get; set; }

        public LearnovaCourse LearnovaCourse { get; set; }
    }
}