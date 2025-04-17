namespace EduPortalAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Add this field
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Student"; // Student, Teacher, Admin
        public string phno { get; set; } = string.Empty;
    }
}