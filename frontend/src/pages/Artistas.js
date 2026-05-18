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
                console.log("Buscando artistas do backend...");
                
                const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/users/artists/');
                
                console.log("Artistas carregados:", data);
                console.log("Quantidade de artistas:", data.length);
                
                const formattedArtists = data.map(artist => ({
                    id: artist.id,
                    username: artist.username,
                    first_name: artist.first_name || '',
                    last_name: artist.last_name || '',
                    profile: {
                        location: artist.profile?.location || 'Local não informado',
                        bio: artist.profile?.bio || 'Artista da comunidade Fibonacci',
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
                console.error("Erro ao carregar lista de artistas:", error);
                console.error("Status do erro:", error.response?.status);
                console.error("Mensagem:", error.response?.data);
                
                setError(error.response?.data?.detail || "Erro ao carregar artistas");
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
        <div className="artists-page animate-fade-in">
            <div className="artists-container">
                <header className="artists-hero">
                    <h1>Artistas da Comunidade</h1>
                    <p>Conheça os criadores locais e explore suas visões e identidades artísticas únicas.</p>
                </header>

                <div className="search-artists-box">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar artista por nome ou cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="artists-loading">
                        <div className="loading-spinner"></div>
                        <p>Carregando catálogo de artistas...</p>
                    </div>
                ) : error ? (
                    <div className="artists-empty">
                        <div className="empty-icon">⚠️</div>
                        <h3>Erro ao carregar artistas</h3>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn-artist-profile"
                            style={{ marginTop: '20px', width: 'auto', padding: '10px 30px' }}
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : filteredArtists.length === 0 ? (
                    <div className="artists-empty">
                        <div className="empty-icon">🎨</div>
                        <h3>Nenhum artista encontrado</h3>
                        <p>{searchTerm ? 'Nenhum artista corresponde à sua busca.' : 'Ainda não há artistas cadastrados.'}</p>
                        {!searchTerm && (
                            <Link to="/cadastro" className="empty-add-btn">
                                Seja o primeiro artista
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="artists-grid">
                        {filteredArtists.map((artist) => (
                            <div className="artist-directory-card" key={artist.id}>
                              
                                <div className="artist-card-banner-wrapper">
                                    <img 
                                        src={artist.profile?.banner_image ? 
                                            (artist.profile.banner_image.startsWith('http') ? 
                                                artist.profile.banner_image : 
                                                `http://127.0.0.1:8000${artist.profile.banner_image}`) : 
                                            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600'} 
                                        alt="Capa" 
                                        className="artist-card-banner"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600';
                                        }}
                                    />
                                </div>

                                <div className="artist-card-avatar-wrapper">
                                    <img 
                                        src={artist.profile?.profile_image ? 
                                            (artist.profile.profile_image.startsWith('http') ? 
                                                artist.profile.profile_image : 
                                                `http://127.0.0.1:8000${artist.profile.profile_image}`) : 
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.first_name || artist.username)}&background=5D4037&color=fff&size=100&rounded=true`} 
                                        alt={artist.username} 
                                        className="artist-card-avatar"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.first_name || artist.username)}&background=5D4037&color=fff&size=100&rounded=true`;
                                        }}
                                    />
                                </div>

                                <div className="artist-card-body">
                                   
                                    <h2 className="artist-card-name">
                                        {artist.first_name ? `${artist.first_name} ${artist.last_name || ''}` : artist.username}
                                    </h2>
                                    
                                    <p className="artist-card-location">
                                        <i className="fas fa-map-marker-alt"></i> {artist.profile?.location || 'Local não informado'}
                                    </p>

                                    <p className="artist-card-bio">
                                        {artist.profile?.bio || 'Este artista ainda não adicionou uma descrição biográfica ao seu perfil público.'}
                                    </p>

                                    <div className="artist-card-socials">
                                        {artist.profile?.instagram && (
                                            <a href={`https://instagram.com/${artist.profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="artist-social-link">
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        )}
                                        {artist.profile?.facebook && (
                                            <a href={`https://facebook.com/${artist.profile.facebook}`} target="_blank" rel="noopener noreferrer" className="artist-social-link">
                                                <i className="fab fa-facebook-f"></i>
                                            </a>
                                        )}
                                        {artist.profile?.twitter && (
                                            <a href={`https://twitter.com/${artist.profile.twitter}`} target="_blank" rel="noopener noreferrer" className="artist-social-link">
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        )}
                                    </div>

                                    <Link to={`/artista/${artist.id}`} className="btn-artist-profile">
                                        Ver Galeria
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Artistas;