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
        public string UploadedBy { get; set; }

        // New fields
        [Required]
        [MaxLength(50)]
        public string Domain { get; set; } // "FullStack", "Frontend", etc.

        [Required]
        [MaxLength(20)]
        public string Level { get; set; } // "Beginner", "Intermediate", "Advanced"
    }

    // Add this enum in the same file or separate
    public enum ContentDomain
    {
        FullStack,
        Frontend,
        Backend,
        DevOps,
        QualityAssurance,
        Cloud
    }
}