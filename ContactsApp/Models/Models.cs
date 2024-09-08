using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ContactsApp.Models
{
    // The User class represents a user in the system
    public class User
    {
        public int Id { get; set; }  // Unique identifier for the user
        public string Username { get; set; }  // Username for login

        public byte[] PasswordHash { get; set; }  // Hash of the user's password
        public byte[] PasswordSalt { get; set; }  // Salt for the password hash

        // A collection of contacts associated with this user
        public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    }

    // The Contact class represents a contact (person) related to a user
    public class Contact
    {
        public int Id { get; set; }  // Unique identifier for the contact

        [Required]
        public string FirstName { get; set; }  // First name of the contact

        [Required]
        public string LastName { get; set; }  // Last name of the contact

        [Required]
        [EmailAddress]
        public string Email { get; set; }  // Email address of the contact

        [Phone]
        public string Phone { get; set; }  // Optional phone number of the contact

        [Required]
        public string Category { get; set; }  // Category for the contact (e.g., business, personal)

        public string Subcategory { get; set; }  // Optional subcategory for further classification

        public DateTime BirthDate { get; set; }  // Birth date of the contact

        public string City { get; set; }  // Optional city where the contact is located
        public string Country { get; set; }  // Optional country where the contact is located

        public int UserId { get; set; }  // Foreign key linking the contact to a user
    }

    // The Category class represents a category, which can have multiple subcategories
    public class Category
    {
        public int Id { get; set; }  // Unique identifier for the category
        public string Name { get; set; }  // Name of the category

        // A collection of subcategories related to this category
        public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
    }

    // The Subcategory class represents a subcategory, which is linked to a specific category
    public class Subcategory
    {
        public int Id { get; set; }  // Unique identifier for the subcategory
        public string Name { get; set; }  // Name of the subcategory

        public int CategoryId { get; set; }  // Foreign key linking the subcategory to a category
        public Category Category { get; set; }  // Navigation property to the related category
    }

    // The UserModel class is used for user registration purposes
    public class UserModel
    {
        public string Username { get; set; }  
        public string Email { get; set; }  

        public string Password { get; set; }  

        // Contact details provided at the time of registration
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }  

        public DateTime? BirthDate { get; set; }  

        public string Subcategory { get; set; }  // Subcategory chosen by the user for the contact
        public string Category { get; set; }  // Category chosen by the user for the contact

        public string City { get; set; }  // City of the contact
        public string Country { get; set; }  // Country of the contact
    }

    // The LoginModel class is used for user login purposes
    public class LoginModel
    {
        public string Username { get; set; }  // Username provided by the user
        public string Password { get; set; }  // Password provided by the user
    }
}
