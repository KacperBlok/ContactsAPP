import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate(); // Hook for navigation

    // Function to handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('username'); 
        navigate('/'); // Redirect to home page
        window.location.reload(); // Reload page to reflect changes
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Logout</button> // Logout button
    );
};

export default Logout;
