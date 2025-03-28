// Updated MultimediaController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EduPortalAPI.Data;
using EduPortalAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace EduPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MultimediaController : ControllerBase
    {
        private readonly ILogger<MultimediaController> _logger;
        private readonly ApplicationDbContext _context;

        public MultimediaController(ILogger<MultimediaController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        private string GetUserEmail()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
            {
                throw new InvalidOperationException("User is not authenticated.");
            }

            var emailClaim = identity.FindFirst(ClaimTypes.Email) ?? identity.FindFirst(ClaimTypes.Name); // Try both

            if (emailClaim == null)
            {
                throw new InvalidOperationException("User email not found");
            }

            return emailClaim.Value;
        }


        [HttpPost("upload-video")]
        public async Task<IActionResult> UploadVideo(IFormFile file, [FromForm] string shortDescription)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (string.IsNullOrWhiteSpace(shortDescription))
                return BadRequest("Short description is required.");

            var allowedExtensions = new[] { ".mp4", ".avi", ".mov" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("Invalid file type. Only video files are allowed.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var multimediaFile = new MultimediaFile
            {
                FileName = file.FileName,
                FileType = file.ContentType,
                FileData = memoryStream.ToArray(),
                ShortDescription = shortDescription,
                UploadedOn = DateTime.UtcNow,
                UploadedBy = GetUserEmail() // Store uploader's email
            };

            _context.MultimediaFiles.Add(multimediaFile);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                multimediaFile.Id,
                message = "Video uploaded successfully",
                fileName = multimediaFile.FileName,
                description = multimediaFile.ShortDescription,
                uploadedOn = multimediaFile.UploadedOn
            });
        }

        [HttpPost("upload-pdf")]
        public async Task<IActionResult> UploadPdf(IFormFile file, [FromForm] string shortDescription)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            if (string.IsNullOrWhiteSpace(shortDescription))
                return BadRequest("Short description is required.");

            var allowedExtensions = new[] { ".pdf" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("Invalid file type. Only PDF files are allowed.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var multimediaFile = new MultimediaFile
            {
                FileName = file.FileName,
                FileType = file.ContentType,
                FileData = memoryStream.ToArray(),
                ShortDescription = shortDescription,
                UploadedOn = DateTime.UtcNow,
                UploadedBy = GetUserEmail() // Store uploader's email
            };

            _context.MultimediaFiles.Add(multimediaFile);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                multimediaFile.Id,
                message = "PDF uploaded successfully",
                fileName = multimediaFile.FileName,
                description = multimediaFile.ShortDescription,
                uploadedOn = multimediaFile.UploadedOn
            });
        }

        [HttpGet("user-files")]
        public IActionResult GetUserFiles([FromQuery] string? email = null)
        {
            // If no email is provided, use the logged-in user's email
            var userEmail = string.IsNullOrWhiteSpace(email) ? GetUserEmail() : email;

            var files = _context.MultimediaFiles
                .Where(f => f.UploadedBy == userEmail)
                .OrderByDescending(f => f.UploadedOn)
                .Select(f => new {
                    f.Id,
                    f.FileName,
                    f.FileType,
                    f.ShortDescription,
                    f.UploadedOn,
                    FileSize = f.FileData.Length
                })
                .ToList();

            return Ok(files);
        }

        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            var file = await _context.MultimediaFiles.FindAsync(id);
            if (file == null || file.UploadedBy != GetUserEmail())
                return NotFound("File not found or unauthorized.");

            return File(file.FileData, file.FileType, file.FileName);
        }

        [HttpGet("all-files")]
        [AllowAnonymous]  // Ensure it allows any authenticated user
        public IActionResult GetAllFiles()
        {
            var files = _context.MultimediaFiles
                .OrderByDescending(f => f.UploadedOn)
                .Select(f => new {
                    f.Id,
                    f.FileName,
                    f.FileType,
                    f.ShortDescription,
                    f.UploadedOn,
                    FileSize = f.FileData.Length,
                    FileData = Convert.ToBase64String(f.FileData) // Encode for inline display
                })
                .ToList();

            return Ok(files);
        }
    }
}