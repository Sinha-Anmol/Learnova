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
using System.ComponentModel.DataAnnotations;

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

            var emailClaim = identity.FindFirst(ClaimTypes.Email) ?? identity.FindFirst(ClaimTypes.Name);
            if (emailClaim == null)
            {
                throw new InvalidOperationException("User email not found");
            }

            return emailClaim.Value;
        }

        [HttpPost("upload-video")]
        public async Task<IActionResult> UploadVideo(
            IFormFile file,
            [FromForm] string shortDescription,
            [FromForm][Required] string domain,
            [FromForm][Required] string level)
        {
            try
            {
                // Validate domain and level
                if (!Enum.TryParse<ContentDomain>(domain, out _))
                    return BadRequest($"Invalid domain. Valid values: {string.Join(", ", Enum.GetNames<ContentDomain>())}");

                if (!new[] { "Beginner", "Intermediate", "Advanced" }.Contains(level))
                    return BadRequest("Level must be Beginner, Intermediate, or Advanced");

                // Existing file validation
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                if (string.IsNullOrWhiteSpace(shortDescription))
                    return BadRequest("Short description is required.");

                var allowedExtensions = new[] { ".mp4", ".avi", ".mov" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest("Invalid file type. Only MP4, AVI, and MOV files are allowed.");

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);

                var multimediaFile = new MultimediaFile
                {
                    FileName = file.FileName,
                    FileType = file.ContentType,
                    FileData = memoryStream.ToArray(),
                    ShortDescription = shortDescription,
                    UploadedOn = DateTime.UtcNow,
                    UploadedBy = GetUserEmail(),
                    Domain = domain,
                    Level = level
                };

                _context.MultimediaFiles.Add(multimediaFile);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    multimediaFile.Id,
                    message = "Video uploaded successfully",
                    fileName = multimediaFile.FileName,
                    description = multimediaFile.ShortDescription,
                    domain = multimediaFile.Domain,
                    level = multimediaFile.Level,
                    uploadedOn = multimediaFile.UploadedOn
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading video");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("upload-pdf")]
        public async Task<IActionResult> UploadPdf(
            IFormFile file,
            [FromForm] string shortDescription,
            [FromForm][Required] string domain,
            [FromForm][Required] string level)
        {
            try
            {
                // Validate domain and level
                if (!Enum.TryParse<ContentDomain>(domain, out _))
                    return BadRequest($"Invalid domain. Valid values: {string.Join(", ", Enum.GetNames<ContentDomain>())}");

                if (!new[] { "Beginner", "Intermediate", "Advanced" }.Contains(level))
                    return BadRequest("Level must be Beginner, Intermediate, or Advanced");

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
                    UploadedBy = GetUserEmail(),
                    Domain = domain,
                    Level = level
                };

                _context.MultimediaFiles.Add(multimediaFile);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    multimediaFile.Id,
                    message = "PDF uploaded successfully",
                    fileName = multimediaFile.FileName,
                    description = multimediaFile.ShortDescription,
                    domain = multimediaFile.Domain,
                    level = multimediaFile.Level,
                    uploadedOn = multimediaFile.UploadedOn
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading PDF");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("user-files")]
        public IActionResult GetUserFiles(
            [FromQuery] string? email = null,
            [FromQuery] string? domain = null,
            [FromQuery] string? level = null)
        {
            try
            {
                var userEmail = string.IsNullOrWhiteSpace(email) ? GetUserEmail() : email;

                var query = _context.MultimediaFiles
                    .Where(f => f.UploadedBy == userEmail);

                if (!string.IsNullOrEmpty(domain))
                    query = query.Where(f => f.Domain == domain);

                if (!string.IsNullOrEmpty(level))
                    query = query.Where(f => f.Level == level);

                var files = query.OrderByDescending(f => f.UploadedOn)
                    .Select(f => new {
                        f.Id,
                        f.FileName,
                        f.FileType,
                        f.ShortDescription,
                        f.Domain,
                        f.Level,
                        f.UploadedOn,
                        FileSize = f.FileData.Length
                    })
                    .ToList();

                return Ok(files);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user files");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("domain-files")]
        public IActionResult GetFilesByDomain(
            [FromQuery] string domain,
            [FromQuery] string? level = null)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching domain files");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("progress")]
        public IActionResult GetProgressAnalysis()
        {
            try
            {
                var progress = _context.MultimediaFiles
                    .Where(f => f.UploadedBy == GetUserEmail())
                    .GroupBy(f => new { f.Domain, f.Level })
                    .Select(g => new {
                        Domain = g.Key.Domain,
                        Level = g.Key.Level,
                        Count = g.Count(),
                        LastAccessed = g.Max(f => f.UploadedOn)
                    })
                    .ToList();

                return Ok(progress);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching progress data");
                return StatusCode(500, "Internal server error");
            }
        }

        [AllowAnonymous]
        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            try
            {
                var file = await _context.MultimediaFiles.FindAsync(id);
                if (file == null)
                    return NotFound("File not found");

                return File(file.FileData, file.FileType, file.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading file");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("all-files")]
        [AllowAnonymous] // Completely open endpoint (no auth required)
        public IActionResult GetAllFiles()
        {
            try
            {
                // Get only essential file metadata without the actual file data
                var files = _context.MultimediaFiles
                    .OrderByDescending(f => f.UploadedOn)
                    .Select(f => new {
                        f.Id,
                        f.FileName,
                        f.FileType,
                        f.ShortDescription,
                        f.Domain,
                        f.Level,
                        f.UploadedOn,
                        FileSize = f.FileData.Length,
                       
                    })
                    .ToList();

                return Ok(files);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all files");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public enum ContentDomain
    {
        FullStack,
        Frontend,
        Backend,
        DevOps,
        QualityAssurance,
        Cloud
    }
}