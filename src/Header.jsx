import React from 'react';
import './App.css';

function Header() {
    return (
        <header>
            <h1>CrashAlert 360</h1>
            <nav>
                <div className="menu-icon">&#9776;</div>
                <div className="dropdown">
                    <button className="dropbtn">Menu</button>
                    <div className="dropdown-content">
                        <a href="#">Home</a>
                        <a href="#">Contacts</a>
                        <a href="#">Help</a>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;