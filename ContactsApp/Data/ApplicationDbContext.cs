using Microsoft.EntityFrameworkCore;
using ContactsApp.Models;

namespace ContactsApp.Data
{
    // The ApplicationDbContext class defines the database context for the application
    public class ApplicationDbContext : DbContext
    {
        // Define a Users table
        public DbSet<User> Users { get; set; }

        // Define a Contacts table
        public DbSet<Contact> Contacts { get; set; }

        // Define a Categories table
        public DbSet<Category> Categories { get; set; }

        // Define a Subcategories table
        public DbSet<Subcategory> Subcategories { get; set; }

        // Constructor that receives options for configuring the context (e.g., database connection)
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Configure relationships and entity behaviors in the model
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure one-to-many relationship between Category and Subcategories
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Subcategories) // Category has many Subcategories
                .WithOne(s => s.Category)      // Each Subcategory has one Category
                .HasForeignKey(s => s.CategoryId); // Subcategory's foreign key is CategoryId

            // Configure one-to-many relationship between User and Contacts
            modelBuilder.Entity<Contact>()
                 .HasOne<User>()           // Each Contact belongs to one User
                .WithMany(u => u.Contacts)  // Each User has many Contacts
                .HasForeignKey(c => c.UserId); // Contact's foreign key is UserId
        }
    }
}
