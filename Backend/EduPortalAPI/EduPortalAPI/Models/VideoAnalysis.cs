using System;
using System.ComponentModel.DataAnnotations;

    namespace EduPortalAPI.Models
    {
    public class VideoAnalysis
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VideoId { get; set; }
        public double CurrentTime { get; set; }
        public double TotalDuration { get; set; }
        public DateTime LastWatched { get; set; }
        public double PercentageWatched { get; set; }
    }
}
