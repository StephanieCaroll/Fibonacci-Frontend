import React, { useState } from 'react';
import '../styles/Navbar.css';
import Sidebar from '../components/Sidebar';
const Navbar = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="navbar-container">
        <div className="container-custom navbar-content">
          <div className="logo">FIBONACCI</div>
          
          <ul className="nav-links">
            <li><a href="/">Galeria</a></li>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>

          <div className="nav-actions">
            <i className="fas fa-shopping-bag"></i>
            
            <div 
              onClick={() => setIsSidebarOpen(true)} 
              style={{ display: 'inline-block', cursor: 'pointer', marginLeft: '20px' }}
            >
              <i className="fas fa-user"></i>
            </div>
          </div>
        </div>
      </nav>

      {/* Agora o Sidebar será encontrado corretamente */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeHandler={() => setIsSidebarOpen(false)} 
        user={user} 
      />
    </>
  );
};

export default Navbar;