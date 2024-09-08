using ContactsApp.Data;
using ContactsApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ContactsApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/contacts
        // Retrieves the list of all contacts from the database
        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            var contacts = await _context.Contacts.ToListAsync();
            return Ok(contacts);
        }

        // GET: api/contacts/{id}
        // Retrieves a specific contact by its ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            // If the contact is not found, return 404
            if (contact == null)
            {
                return NotFound();
            }

            return Ok(contact);
        }

        // POST: api/contacts
        // Creates a new contact and adds it to the database
        [HttpPost]
        public async Task<IActionResult> CreateContact(Contact contact)
        {
            // Add the contact to the database
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            // Return the newly created contact with a 201 status
            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        // PUT: api/contacts/{id}
        // Updates an existing contact
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, [FromBody] Contact contact)
        {
            // Check if the provided ID matches the contact ID
            if (id != contact.Id)
            {
                return BadRequest("ID mismatch");
            }

            // Find the existing contact in the database
            var existingContact = await _context.Contacts.FindAsync(id);
            if (existingContact == null)
            {
                return NotFound();
            }

            // Check if the email is already taken by another contact
            if (await _context.Contacts
                .AnyAsync(c => c.Email == contact.Email && c.Id != id))
            {
                return BadRequest("Email is already taken");
            }

            // Update the existing contact with new values
            existingContact.FirstName = contact.FirstName;
            existingContact.LastName = contact.LastName;
            existingContact.Email = contact.Email;
            existingContact.Phone = contact.Phone;
            existingContact.BirthDate = contact.BirthDate;
            existingContact.Category = contact.Category;
            existingContact.Subcategory = contact.Subcategory;
            existingContact.City = contact.City;
            existingContact.Country = contact.Country;

            // Update UserId only if provided
            if (contact.UserId != 0)
            {
                existingContact.UserId = contact.UserId;
            }

            // Mark the contact entity as modified
            _context.Entry(existingContact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // If the contact does not exist during update, return 404
                if (!ContactExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            // Return 204 No Content if the update is successful
            return NoContent();
        }

        // Method to check if a contact with a specific ID exists in the database
        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }

        // DELETE: api/contacts/{id}
        // Deletes a contact by its ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            // Find the contact in the database by ID
            var contact = await _context.Contacts.FindAsync(id);

            // If the contact is not found, return 404
            if (contact == null)
            {
                return NotFound();
            }

            // Remove the contact from the database
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            // Return 204 No Content if deletion is successful
            return NoContent();
        }
    }
}
