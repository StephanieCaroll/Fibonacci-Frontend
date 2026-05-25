import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css'; 

function HomeBanner() {
    return (
        <section className="home-feature-banner">
            <div className="container-custom">
                <div className="feature-content">
                    <span className="feature-label">Curadoria Especial</span>
                    <h2 className="feature-title">A Quarta Dimensão</h2>
                    <p className="feature-subtitle">
                        Descubra o novo expoente da arte local que transforma espaços e redefine perspectivas.
                    </p>
                    <Link to="/galeria" className="feature-btn">Explorar Coleção →</Link>
                </div>
            </div>
        </section>
    );
}

export default HomeBanner;