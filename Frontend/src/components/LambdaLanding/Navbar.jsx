import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="headerContentWrapper">
            <div className="headerLogoWrapper">
            </div>
            <nav aria-label="Primary" className="mainNav">
                <div className="centerText">Companion AI</div>
            </nav>
            <div className="utilityNav">
                <ul>

                </ul>
            </div>
            <button className="mobileMenuToggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>
        </div>
    );
};

export default Navbar;
