import React, { useState, useEffect } from 'react';
import '../styles/galeria.css';

const Galeria = () => {
  const [obras, setObras] = useState([]);
  const [busca, setBusca] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filtroCat, setFiltroCat] = useState('todas');

  // Simulação de dados 
  useEffect(() => {
    const dadosMock = [
      { id: 1, nome: "A Surpresa", artista: "Watteau", categoria: "pintura", preco: 2800, imagem_url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Jean-Antoine_Watteau_La_Surprise%2C_oil_on_panel.jpg" },
     
    ];
    setObras(dadosMock);
  }, []);

  const obrasFiltradas = obras.filter(obra => 
    (obra.nome.toLowerCase().includes(busca.toLowerCase()) || obra.artista.toLowerCase().includes(busca.toLowerCase())) &&
    (filtroCat === 'todas' || obra.categoria === filtroCat)
  );

  return (
    <div className="galeria-page">
      <section className="galeria-hero">
        <div className="galeria-overlay"></div>
        <div className="hero-content text-center">
          <h1 className="hero-main-title">Galeria</h1>
          <p className="hero-subtitle">Explore obras únicas de artistas locais</p>
        </div>
      </section>

      <div className="container mt-5">
        <div className="search-wrapper-inline mb-4">
          <div className="search-form-clean">
            <div className="search-input-group">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="BUSCAR POR TÍTULO OU PALAVRA-CHAVE..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <button className="btn-filtros-clean" onClick={() => setShowFilters(!showFilters)}>
              <i className="fas fa-sliders-h"></i> FILTROS
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel mb-5 p-4 bg-light border rounded">
            <h6>CATEGORIA</h6>
            <div className="pill-group">
              {['todas', 'pintura', 'desenho', 'fotografia', 'escultura'].map(cat => (
                <button 
                  key={cat} 
                  className={`pill ${filtroCat === cat ? 'active' : ''}`}
                  onClick={() => setFiltroCat(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="row">
          {obrasFiltradas.map(obra => (
            <div key={obra.id} className="col-12 col-sm-6 col-lg-3 mb-4">
              <div className="card-obra">
                <span className="badge-categoria">{obra.categoria.toUpperCase()}</span>
                <img src={obra.imagem_url} className="obra-img" alt={obra.nome} />
                <div className="pt-3">
                  <h6 className="font-weight-bold mb-0">{obra.nome.toUpperCase()}</h6>
                  <small className="text-muted">{obra.artista}</small>
                  <p className="font-weight-bold">R$ {obra.preco}</p>
                  <button className="btn btn-outline-dark btn-sm btn-block">Ver Detalhes</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Galeria;