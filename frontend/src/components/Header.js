import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    // Checa se existe alguém logado
    const userInfo = localStorage.getItem('userInfo');

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
                        <i className="fas fa-shopping-bag"></i>
                        <span className="badge bg-dark rounded-circle position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>0</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Header;