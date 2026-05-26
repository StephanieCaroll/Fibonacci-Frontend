import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css'; 

function Artists({ artists }) {
    const displayArtists = Array.isArray(artists) ? artists.slice(0, 4) : [];

    const getImageUrl = (artist) => {
       
        if (!artist.profile || !artist.profile.profile_image) return null;
        
        const path = artist.profile.profile_image;
     
        if (path.startsWith('http')) return path;
       
        return `http://127.0.0.1:8000${path}`;
    };

    return (
        <div className="artists-evidencia-container container mt-5 mb-5">
            <div className="artists-evidencia-header">
                <h2>ARTISTAS EM EVIDÊNCIA</h2>
                <Link to="/artistas" className="link-ver-todos">
                    VER TODOS &rarr;
                </Link>
            </div>
            
            <div className="artists-evidencia-grid">
                {displayArtists.map((artist) => (
                    <div key={artist.id} className="artist-evidencia-card">
                        <div className="artist-img-wrapper">
                           
                            {getImageUrl(artist) ? (
                                <img 
                                    src={getImageUrl(artist)} 
                                    alt={artist.first_name || artist.username}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = 'https://via.placeholder.com/300x300?text=Sem+Foto';
                                    }}
                                />
                            ) : (
                                <div className="no-image-placeholder" style={{ width: '100%', height: '200px', backgroundColor: '#e0e0e0' }}></div>
                            )}
                        </div>
                        <div className="artist-info">
                            <h3>{artist.first_name || artist.username}</h3>
                            <span className="artist-role">
                                {artist.profile?.location || "Artista"}
                            </span>
                            <p className="artist-desc">
                                {artist.profile?.bio ? artist.profile.bio.substring(0, 100) + '...' : "Sem biografia."}
                            </p>
                            <Link to={`/artista/${artist.id}`} className="link-ver-perfil">
                                VER PERFIL &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Artists;