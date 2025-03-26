using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EduPortalAPI.Data;
using EduPortalAPI.Models;

[Route("api/student")]
[ApiController]
[Authorize(Roles = "Student")]
public class StudentController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StudentController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _context.Courses.ToListAsync();
        return Ok(courses);
    }

    [HttpPost("comment")]
    public async Task<IActionResult> PostComment([FromBody] Comment comment)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Comment added successfully!" });
    }

    [HttpGet("download/{courseId}")]
    public async Task<IActionResult> DownloadPdf(int courseId)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null || string.IsNullOrEmpty(course.PdfUrl))
        {
            return NotFound("PDF not found!");
        }

        return Ok(new { pdfUrl = course.PdfUrl });
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] Message message)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Message sent to teacher!" });
    }

    [HttpPost("submit-quiz")]
    public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmission submission)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.QuizSubmissions.Add(submission);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Quiz submitted successfully!" });
    }
}