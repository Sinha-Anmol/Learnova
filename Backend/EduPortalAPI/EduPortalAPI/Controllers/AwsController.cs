using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using EduPortalAPI.Data; // Your DbContext namespace
using EduPortalAPI.Models; // Your AwsVideo model namespace
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EduPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AwsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "e-learn-fe";
        private readonly ApplicationDbContext _dbContext;

        public AwsController(IConfiguration config, ApplicationDbContext dbContext)
        {
            _config = config;
            _dbContext = dbContext;
            _s3Client = new AmazonS3Client(
                _config["AWS:AccessKey"],
                _config["AWS:SecretKey"],
                Amazon.RegionEndpoint.GetBySystemName(_config["AWS:Region"]));
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadVideo(
            IFormFile file,
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string userId,
            [FromForm] string domain,
            [FromForm] string level)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(domain) || string.IsNullOrEmpty(level) || string.IsNullOrEmpty(title))
                return BadRequest("Missing required fields");

            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            string key = $"{userId}/{domain}/{level}/{fileName}";

            using var stream = file.OpenReadStream();
            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(request);

            string url = $"https://{_bucketName}.s3.{_config["AWS:Region"]}.amazonaws.com/{key}";

            var video = new AwsVideo
            {
                Title = title,
                Description = description,
                UserId = userId,
                Domain = domain,
                Level = level,
                VideoUrl = url
            };

            _dbContext.AwsVideos.Add(video);
            await _dbContext.SaveChangesAsync();

            return Ok(new { url });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVideoById(int id)
        {
            var video = await _dbContext.AwsVideos.FindAsync(id);
            if (video == null)
                return NotFound("Video not found");

            return Ok(new { url = video.VideoUrl });
        }

        [HttpGet("filter")]
        public IActionResult GetVideosByDomainAndLevel([FromQuery] string domain, [FromQuery] string level)
        {
            var videos = _dbContext.AwsVideos
                .Where(v => v.Domain == domain && v.Level == level)
                .Select(v => new { v.VideoUrl })
                .ToList();

            return Ok(videos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(int id)
        {
            var video = await _dbContext.AwsVideos.FindAsync(id);
            if (video == null)
                return NotFound("Video not found");

            try
            {
                var key = new Uri(video.VideoUrl).AbsolutePath.TrimStart('/');
                await _s3Client.DeleteObjectAsync(_bucketName, key);
            }
            catch
            {
                return StatusCode(500, "Failed to delete from S3");
            }

            _dbContext.AwsVideos.Remove(video);
            await _dbContext.SaveChangesAsync();

            return Ok("Video deleted");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVideo(int id, [FromForm] string title, [FromForm] string description, [FromForm] string domain, [FromForm] string level)
        {
            var video = await _dbContext.AwsVideos.FindAsync(id);
            if (video == null)
                return NotFound("Video not found");

            video.Title = title;
            video.Description = description;
            video.Domain = domain;
            video.Level = level;

            _dbContext.AwsVideos.Update(video);
            await _dbContext.SaveChangesAsync();

            return Ok("Video updated");
        }
    }
}
