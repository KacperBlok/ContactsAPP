import React from 'react';
import '../Modal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, contact, onDelete }) => {
    // Initialize useNavigate hook for navigation
    const navigate = useNavigate();

    // Render nothing if the modal is not open
    if (!isOpen) return null;

    // Handle edit button click
    const handleEdit = () => {
        navigate(`/edit-contact/${contact.id}`); // Navigate to the edit page for the selected contact
        onClose(); // Close the modal after navigation
    };

    // Handle delete button click
    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this contact?');
        if (confirm) {
            try {
                // Send delete request to the backend
                await axios.delete(`https://localhost:7092/api/contacts/${contact.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Include auth token
                    }
                });
                onDelete(contact.id); // Update state in the parent component to reflect deletion
                onClose(); // Close the modal after deletion
            } catch (error) {
                console.error('Error deleting contact', error); // Log error if delete fails
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {contact && (
                    <div>
                        <h2>{contact.firstName} {contact.lastName}</h2>
                        <p>Email: {contact.email}</p>
                        <p>Phone: {contact.phone}</p>
                        <p>Birth Date: {new Date(contact.birthDate).toLocaleDateString()}</p>
                        <p>Category: {contact.category}</p>
                        <p>Subcategory: {contact.subcategory}</p>
                        <p>City: {contact.city}</p>
                        <p>Country: {contact.country}</p>
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
