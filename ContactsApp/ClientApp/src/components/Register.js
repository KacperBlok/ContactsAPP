import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    // State variables for form fields and validation
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });
    const [passwordError, setPasswordError] = useState('');

    // List of categories and subcategories
    const categories = [
        { id: 1, name: 'służbowy', subcategories: ['szef', 'klient', 'kolega'] },
        { id: 2, name: 'prywatny' },
        { id: 3, name: 'inny' }
    ];

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Initialize useNavigate hook for navigation
    const navigate = useNavigate();

    // Check if user is logged in
    if (!token) {
        return <p>You need to be logged in to access this page.</p>;
    }

    // Validate password complexity requirements
    const validatePassword = (password) => {
        const length = password.length >= 8;
        const uppercase = /[A-Z]/.test(password);
        const number = /[0-9]/.test(password);
        const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        setPasswordRequirements({ length, uppercase, number, special });
    };

    // Handle password input change
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    // Handle re-enter password input change
    const handleReenterPasswordChange = (e) => {
        setReenterPassword(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if password meets requirements
        if (!passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.number || !passwordRequirements.special) {
            setPasswordError('Password does not meet the required complexity.');
            return;
        }

        // Check if passwords match
        if (password !== reenterPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Send registration request to backend
            await axios.post('https://localhost:7092/api/auth/register', {
                username,
                email,
                password,
                firstName,
                lastName,
                phone,
                birthDate,
                category,
                subcategory,
                city,
                country
            });
            alert('Registration successful!');
            navigate('/');
        } catch (error) {
            console.error('There was an error!', error.response ? error.response.data : error.message);
            alert('Registration failed: ' + (error.response ? error.response.data : error.message));
        }
    };

    // Handle category change and reset subcategory if 'inny' is selected
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        if (selectedCategory === 'inny') {
            setSubcategory('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Input fields for user details */}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            {/* Password and Re-enter Password fields */}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
            />
            <input
                type="password"
                placeholder="Re-enter Password"
                value={reenterPassword}
                onChange={handleReenterPasswordChange}
                required
            />
            <div>
                {/* Display password requirements */}
                <p style={{ color: passwordRequirements.length ? 'green' : 'red' }}>
                    Minimum 8 characters
                </p>
                <p style={{ color: passwordRequirements.uppercase ? 'green' : 'red' }}>
                    At least one uppercase letter
                </p>
                <p style={{ color: passwordRequirements.number ? 'green' : 'red' }}>
                    At least one number
                </p>
                <p style={{ color: passwordRequirements.special ? 'green' : 'red' }}>
                    At least one special character
                </p>
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            </div>

            {/* Input fields for other user details */}
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input type="date" placeholder="Birth Date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />

            {/* Category and Subcategory selection */}
            <select value={category} onChange={handleCategoryChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
            </select>

            {/* Show subcategory options based on selected category */}
            {category === 'służbowy' && (
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required>
                    <option value="">Select Subcategory</option>
                    {categories.find(cat => cat.name === 'służbowy').subcategories.map(subcat => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                </select>
            )}

            {category === 'inny' && (
                <input type="text" placeholder="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required />
            )}

            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
