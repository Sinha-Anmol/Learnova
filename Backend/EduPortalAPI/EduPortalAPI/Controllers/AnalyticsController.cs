using Microsoft.AspNetCore.Mvc;
using EduPortalAPI.Data;
using EduPortalAPI.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace EduPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Analytics/GetUserIdByEmail?email=user@example.com (Anonymous)
        [HttpGet("GetUserIdByEmail")]
        [AllowAnonymous]  // No authentication required
        public async Task<IActionResult> GetUserIdByEmail([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("Email is required.");

            var user = await _context.Users
                .Where(u => u.Email == email)
                .Select(u => new { u.Id, u.Email })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found.");

            return Ok(new { userId = user.Id });
        }

        // POST: api/Analytics (Save Video Watch Progress)
        [HttpPost]
        public async Task<IActionResult> SaveVideoAnalysis([FromBody] VideoAnalysis videoAnalysis)
        {
            if (videoAnalysis == null)
                return BadRequest("Invalid data.");

            var existingRecord = await _context.VideoAnalysis
                .FirstOrDefaultAsync(v => v.UserId == videoAnalysis.UserId && v.VideoId == videoAnalysis.VideoId);

            if (existingRecord != null)
            {
                // Update existing record
                existingRecord.CurrentTime = videoAnalysis.CurrentTime;
                existingRecord.TotalDuration = videoAnalysis.TotalDuration;
                existingRecord.LastWatched = videoAnalysis.LastWatched;
                existingRecord.PercentageWatched = videoAnalysis.PercentageWatched;
            }
            else
            {
                // Create new record
                await _context.VideoAnalysis.AddAsync(videoAnalysis);
            }

            await _context.SaveChangesAsync();
            return Ok("Video progress saved successfully.");
        }

        // GET: api/Analytics?userId=1&videoId=2
        [HttpGet]
        public async Task<IActionResult> GetVideoAnalysis([FromQuery] int userId, [FromQuery] int videoId)
        {
            var videoAnalysis = await _context.VideoAnalysis
                .FirstOrDefaultAsync(v => v.UserId == userId && v.VideoId == videoId);

            if (videoAnalysis == null)
                return NotFound("No progress found for this video.");

            return Ok(videoAnalysis);
        }

        [HttpGet("domain-files")]
        [AllowAnonymous]
        public IActionResult GetFilesByDomain(
        [FromQuery] string domain,
        [FromQuery] string? level = null)
        {
            if (!Enum.TryParse<ContentDomain>(domain, out _))
                return BadRequest("Invalid domain");

            var query = _context.MultimediaFiles
                .Where(f => f.Domain == domain);

            if (!string.IsNullOrEmpty(level))
                query = query.Where(f => f.Level == level);

            var files = query.OrderByDescending(f => f.UploadedOn)
                .Select(f => new {
                    f.Id,
                    f.FileName,
                    f.FileType,
                    f.ShortDescription,
                    f.Level,
                    f.UploadedOn,
                    FileSize = f.FileData.Length
                })
                .ToList();

            return Ok(files);
        }

        [HttpGet("completed-courses/{userId}")]
        [AllowAnonymous]
        public IActionResult GetCompletedCourses(int userId)
        {
            var completedVideoIds = _context.VideoAnalysis
                .Where(v => v.UserId == userId && v.PercentageWatched > 95)
                .Select(v => v.VideoId)
                .ToList();

            if (!completedVideoIds.Any())
                return Ok(new List<object>());

            var completedFiles = _context.MultimediaFiles
                .Where(f => completedVideoIds.Contains(f.Id))
                .Select(f => new {
                    f.Id,
                    f.FileName,
                    f.Domain,
                    f.Level
                })
                .ToList();

            foreach (var file in completedFiles)
            {
                if (!_context.CompletedCourses.Any(c => c.UserId == userId && c.Domain == file.Domain && c.Level == file.Level))
                {
                    _context.CompletedCourses.Add(new CompletedCourse
                    {
                        UserId = userId,
                        Domain = file.Domain,
                        Level = file.Level
                    });
                }
            }

            _context.SaveChanges();
            return Ok(completedFiles);
        }
    }
}
