using ContactsApp.Data;
using ContactsApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ContactsApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, ILogger<AuthController> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserModel model)
        {
            _logger.LogInformation("Register method called with Username: {Username}", model.Username);

            // Check if the model is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the username already exists
            if (await UserExists(model.Username))
            {
                _logger.LogWarning("Registration failed: Username {Username} is already taken", model.Username);
                return BadRequest("Username is already taken");
            }

            // Check if the email is already used in contacts
            if (await EmailExists(model.Email))
            {
                _logger.LogWarning("Registration failed: Email {Email} is already taken", model.Email);
                return BadRequest("Email is already taken");
            }

            // Create a new instance of HMACSHA512 for password hashing
            using var hmac = new HMACSHA512();

            // Create the user object with the hashed password and salt
            var user = new User
            {
                Username = model.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(model.Password)),
                PasswordSalt = hmac.Key
            };

            try
            {
                // Add the new user to the database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create a new contact associated with the registered user
                var contact = new Contact
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    Phone = model.Phone,
                    BirthDate = model.BirthDate ?? DateTime.Now, // Default date if not provided
                    Category = model.Category ?? "Default", // Default category or user-selected
                    Subcategory = model.Subcategory ?? "Default", // Default subcategory or user-selected
                    UserId = user.Id, // Associate the contact with the newly created user
                    City = model.City ?? "DefaultCity", // Default city if not provided
                    Country = model.Country ?? "DefaultCountry" // Default country if not provided
                };

                // Add the contact to the database
                _context.Contacts.Add(contact);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {Username} registered successfully", model.Username);
                return Ok(new { Username = user.Username });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while saving user {Username}", model.Username);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            // Find the user by username in the database
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Username == model.Username.ToLower());

            // If user does not exist, return Unauthorized
            if (user == null)
            {
                return Unauthorized("Invalid username");
            }

            // Validate the password by comparing hash
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(model.Password));

            // Compare byte by byte
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Invalid password");
                }
            }

            // Generate JWT token for authenticated user
            var token = GenerateJwtToken(user);

            return Ok(new { Username = user.Username, Token = token });
        }

        // Method to check if the username already exists in the database
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username.ToLower());
        }

        // Method to check if the email is already associated with a contact
        private async Task<bool> EmailExists(string email)
        {
            return await _context.Contacts.AnyAsync(c => c.Email == email);
        }

        // Method to generate JWT token for authenticated user
        private string GenerateJwtToken(User user)
        {
            // Retrieve JWT settings from configuration
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            // Define claims to be included in the token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique token identifier
            };

            // Create token descriptor including claims, expiry, and signing credentials
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
                Issuer = jwtSettings["Issuer"], // Token issuer
                Audience = jwtSettings["Audience"], // Token audience
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            // Generate and return the token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
