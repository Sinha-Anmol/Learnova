using System.ComponentModel.DataAnnotations;

namespace EduPortalAPI.Models
{
    public class MultimediaFile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string FileType { get; set; }

        [Required]
        public byte[] FileData { get; set; } // Stores the file as a byte array

        public DateTime UploadedOn { get; set; } = DateTime.UtcNow;
    }
}
