import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile.css';

function Profile() {
    // Estado para controlar qual aba está aberta
    const [activeTab, setActiveTab] = useState('obras');

    return (
        <div className="profile-page animate-fade-in">
            {/* Banner de Fundo do Perfil */}
            <img 
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2000" 
                alt="Banner do Perfil" 
                className="profile-banner"
            />

            <div className="profile-header-content">
                {/* Foto de Perfil Centralizada */}
                <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400" 
                    alt="Foto de Perfil" 
                    className="profile-avatar"
                />

                {/* Informações Principais */}
                <h1 className="profile-name">Stephanie Caroll</h1>
                <p className="profile-location"><i className="fas fa-map-marker-alt"></i> Jaboatão dos Guararapes, PE</p>
                
                <p className="profile-bio">
                    Artista Visual. Curadora da própria arte com foco em texturas orgânicas e contrastes urbanos.
                </p>

                <div className="profile-actions">
                    <button className="btn-profile-primary">Editar Perfil</button>
                    <button className="btn-profile-secondary">Configurações</button>
                </div>

                {/* Sistema de Abas (Tabs) */}
                <div className="profile-tabs">
                    <div 
                        className={`profile-tab ${activeTab === 'obras' ? 'active' : ''}`}
                        onClick={() => setActiveTab('obras')}
                    >
                        Minhas Obras
                    </div>
                    <div 
                        className={`profile-tab ${activeTab === 'favoritos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favoritos')}
                    >
                        Favoritos
                    </div>
                    <div 
                        className={`profile-tab ${activeTab === 'sobre' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sobre')}
                    >
                        Sobre
                    </div>
                </div>

                {/* Conteúdo Renderizado Condicionalmente */}
                <div className="container w-100 px-0">
                    
                    {/* ABA: OBRAS */}
                    {activeTab === 'obras' && (
                        <div className="profile-grid">
                            {[1, 2, 3, 4].map((item) => (
                                <Link to={`/product/${item}`} className="profile-art-card" key={item}>
                                    <img 
                                        src={`https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&sig=${item}`} 
                                        alt={`Obra ${item}`} 
                                    />
                                    <h3 className="h6 font-weight-bold mb-1 text-uppercase text-dark">Título da Obra {item}</h3>
                                    <p className="small text-muted mb-1">Óleo sobre tela</p>
                                    <p className="font-weight-bold text-dark" style={{color: '#5D4037'}}>R$ 1.200</p>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* ABA: FAVORITOS */}
                    {activeTab === 'favoritos' && (
                        <div className="text-center py-5">
                            <i className="far fa-heart mb-3" style={{fontSize: '3rem', color: '#E5E5E5'}}></i>
                            <h4 className="text-dark" style={{fontFamily: 'Playfair Display'}}>Nenhuma obra favorita ainda.</h4>
                            <p className="text-muted">Explore a galeria e salve suas peças preferidas aqui.</p>
                            <Link to="/galeria" className="btn-profile-secondary mt-3">Ir para a Galeria</Link>
                        </div>
                    )}

                    {/* ABA: SOBRE */}
                    {activeTab === 'sobre' && (
                        <div className="text-center py-4" style={{maxWidth: '800px', margin: '0 auto'}}>
                            <p className="text-muted" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
                                apaixonada por arte visual, a intersecção entre o moderno e o artesanal define meu trabalho. 
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Profile;