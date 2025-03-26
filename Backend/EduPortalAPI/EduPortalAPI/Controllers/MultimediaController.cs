using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EduPortalAPI.Data; // Add this namespace for your DbContext
using EduPortalAPI.Models; // Add this namespace for your MultimediaFile model

namespace EduPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MultimediaController : ControllerBase
    {
        private readonly ILogger<MultimediaController> _logger;
        private readonly ApplicationDbContext _context; // Add DbContext

        public MultimediaController(ILogger<MultimediaController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context; // Initialize DbContext
        }

        // Video upload endpoint
        [HttpPost("upload-video")]
        public async Task<IActionResult> UploadVideo(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Validate file type (e.g., allow only MP4, AVI, etc.)
            var allowedExtensions = new[] { ".mp4", ".avi", ".mov" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Only video files are allowed.");
            }

            // Convert the file to a byte array
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileData = memoryStream.ToArray();

            // Save the file to the database
            var multimediaFile = new MultimediaFile
            {
                FileName = file.FileName,
                FileType = file.ContentType,
                FileData = fileData,
                UploadedOn = DateTime.UtcNow
            };

            _context.MultimediaFiles.Add(multimediaFile);
            await _context.SaveChangesAsync();

            return Ok(new { multimediaFile.Id, message = "Video uploaded and saved to the database successfully." });
        }

        // PDF upload endpoint
        [HttpPost("upload-pdf")]
        public async Task<IActionResult> UploadPdf(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Validate file type (e.g., allow only PDF)
            var allowedExtensions = new[] { ".pdf" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Only PDF files are allowed.");
            }

            // Convert the file to a byte array
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileData = memoryStream.ToArray();

            // Save the file to the database
            var multimediaFile = new MultimediaFile
            {
                FileName = file.FileName,
                FileType = file.ContentType,
                FileData = fileData,
                UploadedOn = DateTime.UtcNow
            };

            _context.MultimediaFiles.Add(multimediaFile);
            await _context.SaveChangesAsync();

            return Ok(new { multimediaFile.Id, message = "PDF uploaded and saved to the database successfully." });
        }

        // Download file endpoint
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            var file = await _context.MultimediaFiles.FindAsync(id);
            if (file == null)
            {
                return NotFound("File not found.");
            }

            // Return the file as a downloadable response
            return File(file.FileData, file.FileType, file.FileName);
        }
    }
}