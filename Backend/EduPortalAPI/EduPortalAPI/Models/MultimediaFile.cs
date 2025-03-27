// Updated MultimediaFile.cs
using System;
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
        public byte[] FileData { get; set; }

        public DateTime UploadedOn { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(500)]
        public string ShortDescription { get; set; }

        [Required]
        public string UploadedBy { get; set; } // Email of the uploader
    }
}