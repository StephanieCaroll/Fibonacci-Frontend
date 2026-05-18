import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/artistas.css';

function Artistas() {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/users/artists/');
                
                const formattedArtists = data.map(artist => ({
                    id: artist.id,
                    username: artist.username,
                    first_name: artist.first_name || '',
                    last_name: artist.last_name || '',
                    profile: {
                        location: artist.profile?.location || 'Local não informado',
                        bio: artist.profile?.bio || 'Artista da comunidade Fibonacci.',
                        banner_image: artist.profile?.banner_image || null,
                        profile_image: artist.profile?.profile_image || null,
                        instagram: artist.profile?.instagram || null,
                        facebook: artist.profile?.facebook || null,
                        twitter: artist.profile?.twitter || null
                    }
                }));
                
                setArtists(formattedArtists);
                setLoading(false);
                
            } catch (error) {
                setError(error.response?.data?.detail || "Erro ao carregar o catálogo de artistas.");
                setLoading(false);
            }
        };
        
        fetchArtists();
    }, []);

    const filteredArtists = artists.filter(artist => {
        const fullName = `${artist.first_name || ''} ${artist.last_name || ''}`.toLowerCase();
        const username = (artist.username || '').toLowerCase();
        const location = (artist.profile?.location || '').toLowerCase();

        return searchTerm === '' || 
               fullName.includes(searchTerm.toLowerCase()) || 
               username.includes(searchTerm.toLowerCase()) || 
               location.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="artists-page">
            <div className="artists-container">
                
                <header className="artists-hero">
                  
                    <h1 className="hero-title">Nossos Artistas</h1>
                 
                    <p className="hero-subtitle">
                        Explore mentes criativas e descubra novas perspectivas visuais.
                    </p>
                    
                    <div className="search-bar-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input 
                            type="text" 
                            className="search-input"
                            placeholder="Buscar por nome, usuário ou cidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="artists-feedback">
                        <div className="loader"></div>
                        <p>Carregando galeria...</p>
                    </div>
                ) : error ? (
                    <div className="artists-feedback error">
                        <i className="fas fa-exclamation-triangle icon-large"></i>
                        <h3>Não foi possível carregar</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-retry">Tentar novamente</button>
                    </div>
                ) : filteredArtists.length === 0 ? (
                    <div className="artists-feedback empty">
                        <i className="fas fa-paint-brush icon-large"></i>
                        <h3>Nenhum artista encontrado</h3>
                        <p>{searchTerm ? 'Tente buscar com outros termos.' : 'Seja o primeiro a exibir sua arte!'}</p>
                        {!searchTerm && <Link to="/cadastro" className="btn-primary">Criar Perfil</Link>}
                    </div>
                ) : (
                    <div className="modern-artists-grid">
                        {filteredArtists.map((artist) => (
                            <Link to={`/artista/${artist.id}`} className="modern-artist-card" key={artist.id}>
                                
                                <div className="card-image-container">
                                    <img 
                                        src={artist.profile?.banner_image ? 
                                            (artist.profile.banner_image.startsWith('http') ? 
                                                artist.profile.banner_image : 
                                                `http://127.0.0.1:8000${artist.profile.banner_image}`) : 
                                            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop'} 
                                        alt={`Arte de ${artist.username}`} 
                                        className="card-banner-img"
                                    />
                                    <div className="card-overlay"></div>
                                    
                                    <img 
                                        src={artist.profile?.profile_image ? 
                                            (artist.profile.profile_image.startsWith('http') ? 
                                                artist.profile.profile_image : 
                                                `http://127.0.0.1:8000${artist.profile.profile_image}`) : 
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.first_name || artist.username)}&background=111111&color=fff&size=150`} 
                                        alt={artist.username} 
                                        className="card-avatar-img"
                                    />
                                </div>

                                <div className="card-content">
                                    <h2 className="artist-name">
                                        {artist.first_name ? `${artist.first_name} ${artist.last_name || ''}` : artist.username}
                                    </h2>
                                    
                                    <div className="artist-location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <span>{artist.profile?.location}</span>
                                    </div>

                                    <p className="artist-bio">
                                        {artist.profile?.bio}
                                    </p>

                                    <div className="card-footer">
                                        <span className="view-profile-text">Ver Galeria <i className="fas fa-arrow-right"></i></span>
                                        <div className="social-mini-icons">
                                            {artist.profile?.instagram && <i className="fab fa-instagram"></i>}
                                            {artist.profile?.twitter && <i className="fab fa-twitter"></i>}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Artistas;