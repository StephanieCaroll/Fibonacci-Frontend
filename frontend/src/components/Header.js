import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  return (
    <nav className="navbar navbar-light bg-white border-bottom custom-navbar">
      <div className="container-fluid px-3 px-md-5">
        <Link className="navbar-brand logo-fibonacci" to="/">FIBONACCI</Link>

        <div className="menu-wrapper">
          <ul className="nav-menu">
            <li className="nav-item"><Link className="nav-link" to="/">INÍCIO</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/galeria">GALERIA</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/artistas">ARTISTAS</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contato">CONTATO</Link></li>
          </ul>
        </div>

        <div className="header-icons d-flex align-items-center">
          <button className="icon-link btn-link" style={{ background: 'none', border: 'none' }}>
            <i className="fas fa-search"></i>
          </button>
          <Link to="/perfil" className="icon-link"><i className="far fa-user"></i></Link>
          <Link to="/carrinho" className="icon-link position-relative">
            <i className="fas fa-shopping-bag"></i>
            <span className="bag-count">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;