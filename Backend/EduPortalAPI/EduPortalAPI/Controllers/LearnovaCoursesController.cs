using Amazon.S3;
using Amazon.S3.Model;
using EduPortalAPI.Data;
using EduPortalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnovaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LearnovaCoursesController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "e-learn-fe";
        private readonly ApplicationDbContext _dbContext;

        public LearnovaCoursesController(IConfiguration config, ApplicationDbContext dbContext)
        {
            _config = config;
            _dbContext = dbContext;
            _s3Client = new AmazonS3Client(
                _config["AWS:AccessKey"],
                _config["AWS:SecretKey"],
                Amazon.RegionEndpoint.GetBySystemName(_config["AWS:Region"]));
        }

        private string GenerateUID(string courseTitle)
        {
            var randomPart = new Random().Next(10000000, 99999999).ToString();
            var firstWord = courseTitle.Split(' ')[0];
            return $"{randomPart}-{firstWord}";
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCourse(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string keyTopics,
            [FromForm] string domain,
            [FromForm] string level,
            [FromForm] string teacherEmail,
            [FromForm] IFormFileCollection files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded");

            var uid = GenerateUID(title);

            var course = new LearnovaCourse
            {
                Title = title,
                Description = description,
                KeyTopics = keyTopics,
                Domain = domain,
                Level = level,
                TeacherEmail = teacherEmail,
                UID = uid
            };

            _dbContext.LearnovaCourses.Add(course);
            await _dbContext.SaveChangesAsync();

            foreach (var file in files)
            {
                string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                string key = $"{uid}/{fileName}";

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

                var video = new LearnovaCourseVideo
                {
                    FileUrl = url,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    CourseId = course.CourseId
                };

                _dbContext.LearnovaCourseVideos.Add(video);
            }

            await _dbContext.SaveChangesAsync();
            return Ok(new { courseId = course.CourseId, uid = course.UID });
        }

        [HttpGet("{courseId}")]
        public IActionResult GetCourseVideos(int courseId)
        {
            var course = _dbContext.LearnovaCourses
                .Where(c => c.CourseId == courseId)
                .Select(c => new
                {
                    c.Title,
                    c.Description,
                    c.KeyTopics,
                    c.Domain,
                    c.Level,
                    c.UID,
                    Videos = c.Videos.Select(v => new { v.FileUrl, v.FileName })
                })
                .FirstOrDefault();

            if (course == null)
                return NotFound("Course not found");

            return Ok(course);
        }

        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateCourse(int courseId, [FromBody] LearnovaCourse updatedCourse)
        {
            var course = await _dbContext.LearnovaCourses.FindAsync(courseId);
            if (course == null)
                return NotFound("Course not found");

            course.Title = updatedCourse.Title;
            course.Description = updatedCourse.Description;
            course.KeyTopics = updatedCourse.KeyTopics;
            course.Domain = updatedCourse.Domain;
            course.Level = updatedCourse.Level;
            course.TeacherEmail = updatedCourse.TeacherEmail;

            _dbContext.LearnovaCourses.Update(course);
            await _dbContext.SaveChangesAsync();

            return Ok("Course updated");
        }

        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var course = await _dbContext.LearnovaCourses.FindAsync(courseId);
            if (course == null)
                return NotFound("Course not found");

            var videos = _dbContext.LearnovaCourseVideos.Where(v => v.CourseId == courseId).ToList();

            foreach (var video in videos)
            {
                try
                {
                    var key = new Uri(video.FileUrl).AbsolutePath.TrimStart('/');
                    await _s3Client.DeleteObjectAsync(_bucketName, key);
                }
                catch
                {
                    // Ignore individual delete failures, log if needed
                }
                _dbContext.LearnovaCourseVideos.Remove(video);
            }

            _dbContext.LearnovaCourses.Remove(course);
            await _dbContext.SaveChangesAsync();

            return Ok("Course and videos deleted");
        }

        [HttpGet("filter")]
        public IActionResult GetCoursesByDomainAndLevel([FromQuery] string domain, [FromQuery] string level)
        {
            if (string.IsNullOrEmpty(domain) || string.IsNullOrEmpty(level))
                return BadRequest("Both domain and level are required.");

            var courses = _dbContext.LearnovaCourses
                .Where(c => c.Domain == domain && c.Level == level)
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Description,
                    c.KeyTopics,
                    c.TeacherEmail,
                    c.Domain,
                    c.Level,
                    c.CreatedDate,
                    c.UID,
                    Videos = c.Videos.Select(v => new
                    {
                        v.VideoId,
                        v.FileName,
                        v.FileUrl,
                        v.ContentType
                    }).ToList()
                })
                .ToList();

            return Ok(courses);
        }

        [HttpGet("filter2")]
        public IActionResult GetCoursesByUID([FromQuery] string Uid)
        {
            if (string.IsNullOrEmpty(Uid))
                return BadRequest("UID is required.");

            var courses = _dbContext.LearnovaCourses
                .Where(c => c.UID == Uid)
                .Select(c => new
                {
                    c.CourseId,
                    c.Title,
                    c.Description,
                    c.KeyTopics,
                    c.TeacherEmail,
                    c.Domain,
                    c.Level,
                    c.CreatedDate,
                    c.UID,
                    Videos = c.Videos.Select(v => new
                    {
                        v.VideoId,
                        v.FileName,
                        v.FileUrl,
                        v.ContentType
                    }).ToList()
                })
                .ToList();

            return Ok(courses);
        }

    }
}