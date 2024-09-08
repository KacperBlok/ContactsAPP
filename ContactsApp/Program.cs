using ContactsApp.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure DbContext to use SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services for controllers
builder.Services.AddControllers();

// Configure CORS (Cross-Origin Resource Sharing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin() // Allow requests from any origin
                  .AllowAnyMethod() // Allow all HTTP methods (GET, POST, etc.)
                  .AllowAnyHeader(); // Allow all headers
        });
});

// JWT (JSON Web Token) settings
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]); // Use UTF8 encoding for the key

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // Validate the issuer of the token
        ValidateAudience = true, // Validate the audience of the token
        ValidateLifetime = true, // Validate the token expiration
        ValidateIssuerSigningKey = true, // Validate the signing key
        ValidIssuer = jwtSettings["Issuer"], // Valid issuer of the token
        ValidAudience = jwtSettings["Audience"], // Valid audience of the token
        IssuerSigningKey = new SymmetricSecurityKey(key) // Key used to sign the token
    };
});

builder.Services.AddAuthorization();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowAll");

// Enable Swagger UI in development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS

app.UseAuthentication(); // Enable authentication middleware
app.UseAuthorization(); // Enable authorization middleware

app.MapControllers(); // Map controller routes

app.Run(); // Run the application
