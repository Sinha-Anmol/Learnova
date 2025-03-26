using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using EduPortalAPI.Data;
using EduPortalAPI.Models;

[Route("api/tasks")]
[ApiController]
[Authorize(Roles = "Student")]
public class TaskController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TaskController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 📌 Add a New Task
    [HttpPost("add")]
    public async Task<IActionResult> AddTask([FromBody] TaskModel task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Task added successfully!" });
    }

    // 📌 Get All Tasks for a Student
    [HttpGet("get/{studentEmail}")]
    public async Task<IActionResult> GetTasks(string studentEmail)
    {
        var tasks = await _context.Tasks
                                  .Where(t => t.StudentEmail == studentEmail)
                                  .ToListAsync();
        return Ok(tasks);
    }

    // 📌 Mark Task as Completed
    [HttpPut("complete/{taskId}")]
    public async Task<IActionResult> CompleteTask(int taskId)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task == null) return NotFound("Task not found!");

        task.IsCompleted = true;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Task marked as completed!" });
    }

    // 📌 Delete a Task
    [HttpDelete("delete/{taskId}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task == null) return NotFound("Task not found!");

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Task deleted successfully!" });
    }
}
