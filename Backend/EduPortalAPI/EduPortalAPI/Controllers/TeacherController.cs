using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EduPortalAPI.Data;
using EduPortalAPI.Models;

[Route("api/teacher")]
[ApiController]
[Authorize(Roles = "Teacher")]
public class TeacherController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TeacherController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("upload-course")]
    public async Task<IActionResult> UploadCourse([FromBody] Course course)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Course uploaded successfully!" });
    }

    [HttpPost("upload-pdf/{courseId}")]
    public async Task<IActionResult> UploadPdf(int courseId, [FromBody] string pdfUrl)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null)
        {
            return NotFound("Course not found!");
        }

        course.PdfUrl = pdfUrl;
        await _context.SaveChangesAsync();
        return Ok(new { message = "PDF uploaded successfully!" });
    }

    [HttpPost("upload-quiz")]
    public async Task<IActionResult> UploadQuiz([FromBody] Quiz quiz)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Quiz uploaded successfully!" });
    }

    [HttpPost("reply-comment")]
    public async Task<IActionResult> ReplyToComment([FromBody] CommentReply reply)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.CommentReplies.Add(reply);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Reply added successfully!" });
    }
}