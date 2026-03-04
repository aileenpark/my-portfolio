import React, { useState } from 'react';
import './Header.css';
import logoUrl from '../assets/logo.svg';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header" data-name="header" data-node-id="16:93">
            <div className="header-content">
                <a href="/" className="header-logo" data-name="header/logo" data-node-id="16:95">
                    <img alt="NP Logo" className="logo-img" src={logoUrl} />
                </a>

                {/* Desktop Navigation */}
                <nav className="header-nav-desktop" data-name="header/nav" data-node-id="16:109">
                    <a href="#works" className="nav-link" data-name="nav/works" data-node-id="16:110">
                        <span className="nav-text" data-node-id="16:111">Works</span>
                    </a>
                    <a href="#about" className="nav-link" data-name="nav/about" data-node-id="16:112">
                        <span className="nav-text" data-node-id="16:113">About</span>
                    </a>
                    <a href="#resume" className="nav-link" data-name="nav/resume" data-node-id="16:114">
                        <span className="nav-text" data-node-id="16:115">Résumé</span>
                    </a>
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <a href="#works" onClick={() => setIsMenuOpen(false)}>Works</a>
                    <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                    <a href="#resume" onClick={() => setIsMenuOpen(false)}>Résumé</a>
                </nav>
            </div>
        </header>
    );
}
