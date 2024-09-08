import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const ContactList = () => {
    const [contacts, setContacts] = useState([]); // State to store the list of contacts
    const [selectedContact, setSelectedContact] = useState(null); // State to store the currently selected contact
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
    const token = localStorage.getItem('token'); // Retrieve JWT token from local storage

    useEffect(() => {
        // Function to fetch the list of contacts from the API
        const fetchContacts = async () => {
            try {
                const response = await axios.get('https://localhost:7092/api/contacts', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include JWT token in the request headers
                    }
                });
                setContacts(response.data); // Update state with fetched contacts
            } catch (error) {
                console.error('There was an error!', error); // Handle errors
            }
        };

        fetchContacts(); // Call the fetch function on component mount
    }, [token]); // Dependency array: re-fetch contacts if token changes

    // Function to handle click on a contact item
    const handleContactClick = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7092/api/contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include JWT token in the request headers
                }
            });
            setSelectedContact(response.data); // Set selected contact details
            setIsModalOpen(true); // Open the modal
        } catch (error) {
            console.error('Error fetching contact details', error); // Handle errors
        }
    };

    // Function to handle contact deletion
    const handleDelete = (id) => {
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id)); // Remove contact from the list
        setSelectedContact(null); // Close the modal after deletion
    };

    return (
        <div>
            <ul>
                {contacts.map(contact => (
                    <li
                        key={contact.id}
                        onClick={() => handleContactClick(contact.id)} // Handle click event
                        style={{
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderBottom: '1px solid #ddd'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} // Highlight on hover
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'} // Revert hover effect
                    >
                        <div>{contact.firstName} {contact.lastName}</div>
                        <div style={{ fontSize: '0.9em', color: '#555' }}>{contact.email}</div>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close modal when requested
                contact={selectedContact}
                onDelete={handleDelete} // Handle contact deletion
            />
        </div>
    );
};

export default ContactList;
