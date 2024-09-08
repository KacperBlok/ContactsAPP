import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditContact = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contact, setContact] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        category: '',
        subcategory: '',
        city: '',
        country: ''
    });
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await axios.get(`https://localhost:7092/api/contacts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const contactData = response.data;
                setContact({
                    ...contactData,
                    birthDate: contactData.birthDate.split('T')[0], // Format yyyy-MM-dd
                    city: contactData.city || '',
                    country: contactData.country || ''
                });

                // Set subcategory options based on the category
                if (contactData.category === 'służbowy') {
                    setSubcategoryOptions(['szef', 'klient', 'kolega']); // Update with actual subcategories if available
                } else if (contactData.category === 'inny') {
                    setSubcategoryOptions([]); // Option to enter custom subcategory
                } else {
                    setSubcategoryOptions([]);
                }
            } catch (error) {
                console.error('Error fetching contact', error);
            }
        };

        fetchContact();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContact(prevContact => ({
            ...prevContact,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { user, ...contactData } = contact;

        try {
            await axios.put(`https://localhost:7092/api/contacts/${id}`, contactData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Contact updated successfully');
            navigate('/contacts');
        } catch (error) {
            console.error('Error updating contact:', error.response ? error.response.data : error.message);
            alert(error.response?.data || 'An error occurred while updating the contact.');
        }
    };


    return (
        <div>
            <h2>Edit Contact</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={contact.firstName}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={contact.lastName}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={contact.email}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={contact.phone}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Birth Date:
                    <input
                        type="date"
                        name="birthDate"
                        value={contact.birthDate}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Category:
                    <select
                        name="category"
                        value={contact.category}
                        onChange={handleChange}
                    >
                        
                        <option value="służbowy">służbowy</option>
                        <option value="prywatny">prywatny</option>
                        <option value="inny">inny</option>
                    </select>
                </label>
                <br />
                {contact.category === 'służbowy' && (
                    <label>
                        Subcategory:
                        <select
                            name="subcategory"
                            value={contact.subcategory}
                            onChange={handleChange}
                        >
                            
                            {subcategoryOptions.map((subcat) => (
                                <option key={subcat} value={subcat}>
                                    {subcat}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                {contact.category === 'inny' && (
                    <label>
                        Subcategory:
                        <input
                            type="text"
                            name="subcategory"
                            value={contact.subcategory}
                            onChange={handleChange}
                            placeholder="Subcategory"
                        />
                    </label>
                )}
                <br />
                <label>
                    City:
                    <input
                        type="text"
                        name="city"
                        value={contact.city}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Country:
                    <input
                        type="text"
                        name="country"
                        value={contact.country}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditContact;
