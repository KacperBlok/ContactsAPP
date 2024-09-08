import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState(''); // State for username input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7092/api/auth/login', {
                username,
                password,
            });
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token); // Store JWT token
            localStorage.setItem('username', username); // Store username
            window.location.href = '/contacts'; // Redirect to contacts page
        } catch (error) {
            console.error('Login error details:', error.response ? error.response.data : error.message);
            setError('Login failed: ' + (error.response ? error.response.data : error.message)); // Set error message
        }
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    {error && <p className="error">{error}</p>} {/* Display error message */}
                </form>
            </div>
        </div>
    );
};

export default Login;
