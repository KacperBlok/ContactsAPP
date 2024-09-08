import React from 'react';
import { NavLink } from 'react-router-dom';
import Logout from './Logout'; 

const NavBarLoggedIn = () => {
    const username = localStorage.getItem('username') || 'User';

    return (
        <header className="navbar">
            <NavLink to="/" className="navbar-brand">Contact Management</NavLink> 
            <div className="navbar-right">
                <span className="welcome-message">Welcome, {username}</span>
                <NavLink to="/register" className="nav-link">Register</NavLink>
                <Logout /> 
            </div>
        </header>
    );
};

const NavBarLoggedOut = () => {
    return (
        <header className="navbar">
            <div className="navbar-brand">Contact Management</div>
            <nav>
                <NavLink to="/" end activeClassName="active">Login</NavLink>
            </nav>
        </header>
    );
};

const NavBar = () => {
    const token = localStorage.getItem('token');

    return (
        <>
            {token ? <NavBarLoggedIn /> : <NavBarLoggedOut />}
        </>
    );
};

export default NavBar;
