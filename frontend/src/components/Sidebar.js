import React, { useEffect, useRef } from 'react';
import '../styles/Sidebar.css';
import { useHistory } from 'react-router-dom';
import { FaUser, FaUserEdit, FaShoppingBag, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, closeHandler, user }) => {
    const sidebarRef = useRef(null);
    const history = useHistory();

    // Lógica para fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeHandler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeHandler]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        closeHandler();
        history.push('/login');
    };

    const navigateTo = (path) => {
        history.push(path);
        closeHandler();
    };

    // Não renderiza nada se o menu estiver fechado
    if (!isOpen) return null;

    return (
        <div ref={sidebarRef} className="sidebar open">
            <div className="sidebar-header">
                <button className="close-btn" onClick={closeHandler}>
                    <FaTimes />
                </button>
            </div>
            
            <div className="profile-header">
                <p>Olá,</p>
                <h3>{user?.name || 'Visitante'}</h3>
            </div>

            <ul className="menu-list">
                <li onClick={() => navigateTo('/perfil-artista')}><FaUserEdit /> PERFIL DO ARTISTA</li>
                <li onClick={() => navigateTo('/minha-conta')}><FaUser /> MINHA CONTA</li>
                <li onClick={() => navigateTo('/compras')}><FaShoppingBag /> COMPRAS</li>
            </ul>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="btn-logout">
                    SAIR DA CONTA <FaSignOutAlt />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
