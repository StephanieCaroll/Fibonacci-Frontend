import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Sidebar from '../components/Sidebar'; 
import '../styles/header.css'; 

function Header() {
    const { cartItems } = useContext(CartContext);
    const [cartCount, setCartCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const userInfoString = localStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const updateCartCount = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(totalItems);
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        const interval = setInterval(updateCartCount, 1000);
        return () => {
            window.removeEventListener('storage', updateCartCount);
            clearInterval(interval);
        };
    }, [cartItems]);

    return (
        <nav className="navbar-container">
            <div className="container-custom navbar-content">
                {/* Logo */}
                <Link to="/" className="logo">FIBONACCI</Link>
                
                {/* Links de navegação */}
                <ul className="nav-links">
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/galeria">Galeria</Link></li>
                    <li><Link to="/artistas">Artistas</Link></li>
                </ul>

                {/* Ações (Busca, User, Cart) */}
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