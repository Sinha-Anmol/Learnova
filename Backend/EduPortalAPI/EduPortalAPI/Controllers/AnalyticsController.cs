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
    }
}
