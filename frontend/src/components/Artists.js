import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const API_BASE = 'http://127.0.0.1:8000';

const DEFAULT_ARTIST_IMAGES = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80'
];

function Artists({ artists }) {
    const displayArtists = Array.isArray(artists) ? artists.slice(0, 4) : [];

    const getArtistId = (artist, index) => artist.id || artist._id || artist.username || index;

    const getArtistName = (artist) => {
        if (artist.name) return artist.name;
        if (artist.first_name) return `${artist.first_name} ${artist.last_name || ''}`.trim();
        return artist.username || 'Artista Fibonacci';
    };

    const getDefaultImage = (artist, index) => {
        const seed = String(getArtistId(artist, index));
        const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return DEFAULT_ARTIST_IMAGES[hash % DEFAULT_ARTIST_IMAGES.length];
    };

    const getImageUrl = (artist, index) => {
        const path =
            artist.profile?.profile_image ||
            artist.profile?.avatar ||
            artist.profile_image ||
            artist.avatar ||
            artist.image;

        if (!path) return getDefaultImage(artist, index);
        if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
        return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
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
                {displayArtists.map((artist, index) => (
                    <div key={getArtistId(artist, index)} className="artist-evidencia-card">
                        <div className="artist-img-wrapper">
                            <img
                                src={getImageUrl(artist, index)}
                                alt={getArtistName(artist)}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getDefaultImage(artist, index);
                                }}
                            />
                        </div>
                        <div className="artist-info">
                            <h3>{getArtistName(artist)}</h3>
                            <span className="artist-role">
                                {artist.profile?.location || artist.location || 'Artista'}
                            </span>
                            <p className="artist-desc">
                                {artist.profile?.bio ? `${artist.profile.bio.substring(0, 100)}...` : 'Perfil artístico em construção.'}
                            </p>
                            <Link to={artist.id || artist._id ? `/artista/${artist.id || artist._id}` : '/artistas'} className="link-ver-perfil">
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
