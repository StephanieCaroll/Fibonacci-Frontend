import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/home.css';

function ArtistSection() {
    const history = useHistory();

    // Dados de exemplo (se você tiver uma API de artistas, substitua aqui)
    const artists = [
        { id: 1, name: "Beka Studio", image: "URL_DA_IMAGEM_1" },
        { id: 2, name: "Raphael Dias", image: "URL_DA_IMAGEM_2" },
        { id: 3, name: "Ohma Design", image: "URL_DA_IMAGEM_3" },
    ];

    return (
        <section className="artist-section-container">
            <div className="section-header">
                <h2>Descubra Criadores</h2>
                <button onClick={() => history.push('/artistas')} className="view-more-link">
                    Ver Todos →
                </button>
            </div>

            <div className="artist-carousel">
                {artists.map((artist) => (
                    <div key={artist.id} className="artist-card" onClick={() => history.push('/artistas')}>
                        <img src={artist.image} alt={artist.name} />
                        <div className="artist-overlay">
                            <h3>{artist.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ArtistSection;