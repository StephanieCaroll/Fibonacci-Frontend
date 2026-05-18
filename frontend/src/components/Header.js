import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [cartCount, setCartCount] = useState(0);
    
    const userInfo = localStorage.getItem('userInfo');

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
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
    }, []);

    useEffect(() => {
        const handleFocus = () => updateCartCount();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    return (
        <nav className="navbar navbar-expand-lg bg-white py-4 border-bottom sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/" style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 'bold', 
                    letterSpacing: '4px',
                    color: '#5D4037'
                }}>
                    FIBONACCI
                </Link>
                
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link className="nav-link px-4 text-uppercase small font-weight-bold" to="/">Início</Link></li>
                        <li className="nav-item"><Link className="nav-link px-4 text-uppercase small font-weight-bold" to="/galeria">Galeria</Link></li>
                        <li className="nav-item"><Link className="nav-link px-4 text-uppercase small font-weight-bold" to="/artistas">Artistas</Link></li>
                    </ul>
                </div>

                <div className="d-flex align-items-center" style={{ gap: '20px' }}>
                    <Link to="/galeria" className="text-dark">
                        <i className="fas fa-search cursor-pointer"></i>
                    </Link>
                    
                    <Link to={userInfo ? "/perfil" : "/login"} className="text-dark">
                        <i className="far fa-user"></i>
                    </Link>
                    
                    <Link to="/cart" className="text-dark position-relative">
                        <i className="fas fa-shopping-bag" style={{ fontSize: '1.2rem' }}></i>
                        {cartCount > 0 && (
                            <span className="cart-badge">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Header;