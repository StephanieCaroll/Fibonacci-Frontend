import React from 'react';
import '../styles/artists.css';

function Artists({ artists }) {
  if (!artists || artists.length === 0) return null;

  return (
    <section className="artists-section">
      <div className="artists-header">
        <h2>Descubra Artistas</h2>
        <a href="/artists" className="ver-todos">VER TODOS →</a>
      </div>

      <div className="artists-grid">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-card">
            {/* Usando profile_image vindo da API */}
            <img src={artist.profile_image} alt={artist.username} />
            
            {/* Usando username vindo da API */}
            <h3>{artist.username}</h3>
            
            {/* Como não temos 'especialidade' na API, você pode colocar a bio aqui */}
            <p className="especialidade">{artist.location}</p>
            
            <p className="bio">{artist.bio}</p>
            <a href={`/artists/${artist.id}`} className="perfil-link">VER PERFIL →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Artists;