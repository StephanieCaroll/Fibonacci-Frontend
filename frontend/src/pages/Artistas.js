import React, { useState, useEffect } from 'react';
import axios from 'react-redux'; 
import axiosPure from 'axios';
import { Link } from 'react-router-dom';
import '../styles/artistas.css';

function Artistas() {
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                // Rota correspondente ao include do seu 'fibonacci.urls.user_urls'
                const { data } = await axiosPure.get('http://127.0.0.1:8000/fibonacci/users/artists/');
                setArtists(data || []);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar lista de artistas:", error);
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    // Filtra os artistas com base no termo digitado na barra de busca
    const filteredArtists = artists.filter(artist => {
        const fullName = `${artist.first_name || ''} ${artist.last_name || ''}`.toLowerCase();
        const username = (artist.username || '').toLowerCase();
        const location = (artist.profile?.location || '').toLowerCase();

        return fullName.includes(searchTerm.toLowerCase()) || 
               username.includes(searchTerm.toLowerCase()) || 
               location.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="artists-page animate-fade-in">
            <div className="container">
                {/* Cabeçalho da Seção */}
                <header className="artists-hero">
                    <h1>Artistas da Comunidade</h1>
                    <p>Conheça os criadores locais e explore suas visões e identidades artísticas únicas.</p>
                </header>

                {/* Caixa de Pesquisa Dinâmica */}
                <div className="search-artists-box">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar artista por nome ou cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Renderização Condicional do Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <p className="text-muted">Carregando catálogo de artistas...</p>
                    </div>
                ) : filteredArtists.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">Nenhum artista foi encontrado com os termos inseridos.</p>
                    </div>
                ) : (
                    <div className="artists-grid">
                        {filteredArtists.map((artist) => (
                            <div className="artist-directory-card" key={artist.id}>
                                {/* Imagem de Capa do Perfil (Banner) */}
                                <img 
                                    src={artist.profile?.banner_image ? `http://127.0.0.1:8000${artist.profile.banner_image}` : 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600'} 
                                    alt="Capa" 
                                    className="artist-card-banner"
                                />

                                {/* Avatar Circular Embutido */}
                                <img 
                                    src={artist.profile?.profile_image ? `http://127.0.0.1:8000${artist.profile.profile_image}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300'} 
                                    alt={artist.username} 
                                    className="artist-card-avatar"
                                />

                                <div className="artist-card-body">
                                    {/* Nome Completo do Usuário / Fallback para Username */}
                                    <h2 className="artist-card-name">
                                        {artist.first_name ? `${artist.first_name} ${artist.last_name || ''}` : artist.username}
                                    </h2>
                                    
                                    {/* Localização vinda do ArtistProfile */}
                                    <p className="artist-card-location">
                                        <i className="fas fa-map-marker-alt"></i> {artist.profile?.location || 'Recife, PE'}
                                    </p>

                                    {/* Minibiografia descritiva */}
                                    <p className="artist-card-bio">
                                        {artist.profile?.bio || 'Este artista ainda não adicionou uma descrição biográfica ao seu perfil público.'}
                                    </p>

                                    {/* Redes Sociais do Artista */}
                                    <div className="artist-card-socials">
                                        {artist.profile?.instagram && (
                                            <a href={`https://instagram.com/${artist.profile.instagram}`} target="_blank" rel="noreferrer" className="artist-social-link">
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        )}
                                        {artist.profile?.facebook && (
                                            <a href={`https://facebook.com/${artist.profile.facebook}`} target="_blank" rel="noreferrer" className="artist-social-link">
                                                <i className="fab fa-facebook-f"></i>
                                            </a>
                                        )}
                                        {artist.profile?.twitter && (
                                            <a href={`https://twitter.com/${artist.profile.twitter}`} target="_blank" rel="noreferrer" className="artist-social-link">
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        )}
                                    </div>

                                    <Link to={`/artist/${artist.id}`} className="btn-artist-profile text-center">
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