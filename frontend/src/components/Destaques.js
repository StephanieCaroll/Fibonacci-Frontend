import React from 'react';
import '../styles/destaques.css';

function Destaques({ produtos, title, link }) {
  if (!produtos || produtos.length === 0) return null;

  return (
    <section className="destaques-section">
      <div className="destaques-header">
         <h2>{title}</h2>
         {link && <a href={link} className="ver-mais-link">Ver Mais</a>}
      </div>

      <div className="product-grid">
        {produtos.map((produto) => (
          <div key={produto._id || produto.id} className="product-card">
            <div className="image-wrapper">
              <img 
                src={produto.image ? (produto.image.startsWith('http') ? produto.image : `http://127.0.0.1:8000${produto.image}`) : ''} 
                alt={produto.name || "Obra de arte"} 
              />
            </div>
            <div className="info">
              <h3>{produto.name}</h3>
              <p className="artist-name">{produto.brand || "Artista desconhecido"}</p>
              <div className="price">R$ {produto.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Destaques;