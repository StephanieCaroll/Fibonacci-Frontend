import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Sidebar from '../components/Sidebar'; 
import '../styles/header.css'; 

function Header() {
    const { cartItems } = useContext(CartContext);
    const [cartCount, setCartCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const updateCartCount = useCallback(() => {
        const totalItems = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(totalItems);
    }, [cartItems]);

    useEffect(() => {
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        const interval = setInterval(updateCartCount, 1000);
        return () => {
            window.removeEventListener('storage', updateCartCount);
            clearInterval(interval);
        };
    }, [updateCartCount]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar-container">
            <div className="container-custom navbar-content">
                
                <button 
                    className="mobile-menu-btn" 
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <i className="fas fa-bars"></i>
                </button>

                
                <Link to="/" className="logo" onClick={closeMobileMenu}>FIBONACCI</Link>
               
                <div 
                    className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
                    onClick={closeMobileMenu}
                ></div>

                <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-nav-header">
                        <span className="logo-mobile">MENU</span>
                        <button className="mobile-close-btn" onClick={closeMobileMenu}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <li><Link to="/" onClick={closeMobileMenu}>INÍCIO</Link></li>
                    <li><Link to="/galeria" onClick={closeMobileMenu}>GALERIA</Link></li>
                    <li><Link to="/artistas" onClick={closeMobileMenu}>ARTISTAS</Link></li>
                    <li><Link to="/sobre" onClick={closeMobileMenu}>SOBRE</Link></li>
                </ul>

                <div className="nav-actions">
                    <Link to="/galeria" className="nav-icon"><i className="fas fa-search"></i></Link>
                    
                    <div className="user-menu-container">
                        {userInfo ? (
                            <span onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="nav-icon cursor-pointer">
                                <i className="far fa-user"></i>
                            </span>
                        ) : (
                            <Link to="/login" className="nav-icon"><i className="far fa-user"></i></Link>
                        )}
                        <Sidebar 
                            isOpen={isSidebarOpen} 
                            closeHandler={() => setIsSidebarOpen(false)} 
                            user={userInfo} 
                        />
                    </div>
                    
                    <Link to="/cart" className="nav-icon position-relative">
                        <i className="fas fa-shopping-bag"></i>
                        {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Header;
