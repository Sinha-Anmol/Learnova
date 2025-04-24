using Microsoft.EntityFrameworkCore;
using EduPortalAPI.Models;

namespace EduPortalAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizSubmission> QuizSubmissions { get; set; }
        public DbSet<CommentReply> CommentReplies { get; set; }
        public DbSet<TaskModel> Tasks { get; set; }
        public DbSet<MultimediaFile> MultimediaFiles { get; set; }
        public DbSet<VideoAnalysis> VideoAnalysis { get; set; }
        public DbSet<CompletedCourse> CompletedCourses { get; set; }
        public DbSet<AwsVideo> AwsVideos { get; set; }
        public DbSet<PremiumPayment> PremiumPayments { get; set; }
        public DbSet<OtpRequest> OtpR { get; set; }
        public DbSet<OtpVerify> OtpV { get; set; }
    }
}
