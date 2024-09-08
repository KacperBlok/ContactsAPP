import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ContactList from './components/ContactList';
import NavBar from './components/NavBar';
import EditContact from './components/EditContact';
import './styles.css';

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <NavBar />
            <div className="container">
                <Routes>
                    <Route path="/" element={token ? <ContactList /> : <Login />} />
                    <Route path="/register" element={token ? <Register /> : <Login />} />
                    <Route path="/contacts" element={token ? <ContactList /> : <Login />} />
                    
                    <Route path="/edit-contact/:id" element={token ? <EditContact /> : <Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
