import React from 'react';
import '../styles/home.css'; 

function HomeBanner() {
    return (
        <section className="home-hero-banner">
            <div className="banner-overlay"></div>
            <div className="banner-content">
                <h2 className="banner-title">A Quarta Dimensão</h2>
                <p className="banner-subtitle">Descubra o novo expoente da arte local que transforma espaços.</p>
                <a href="/galeria" className="btn-banner">Explorar Coleção</a>
            </div>
        </section>
    );
}

export default HomeBanner;