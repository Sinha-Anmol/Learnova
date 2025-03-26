using Microsoft.AspNetCore.Mvc;
using EduPortalAPI.Data;
using EduPortalAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
        {
            return BadRequest("User already exists.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        var dbUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == userLoginDto.Email);
        if (dbUser == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, dbUser.PasswordHash))
        {
            return Unauthorized("Invalid credentials");
        }

        if (dbUser.Role != userLoginDto.Role)
        {
            return Unauthorized("Role mismatch.");
        }

        var token = GenerateJwtToken(dbUser);
        return Ok(new { token });
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(3),
            Issuer = _configuration["Jwt:Issuer"], // Add issuer
            Audience = _configuration["Jwt:Audience"], // Add audience
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

public class UserLoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
