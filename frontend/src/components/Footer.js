import React from 'react';
import '../styles/footer.css';

function Footer() {
    return (
        <>
            <section className="artist-invite">
                <div className="container text-center">
                    <h2 className="artist-title">Você é artista?</h2>
                    <p className="artist-description">
                        Mostre seu trabalho para o mundo. Cadastre suas obras gratuitamente e conecte-se com amantes da arte que valorizam criações autênticas.
                    </p>
                    <button className="btn-artist-cta">
                        Começar a vender 
                        <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </section>

            <footer className="main-footer">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-4 mb-4 mb-md-0">
                            <div className="footer-brand">
                                <h3 className="footer-logo">FIBONACCI</h3>
                                <p className="footer-description">Conectando artistas locais e amantes da arte através de obras únicas e autênticas.</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-2 mb-4 mb-md-0">
                            <h6 className="footer-title">Navegação</h6>
                            <ul className="footer-links-list">
                                <li><a href="/galeria">Galeria</a></li>
                                <li><a href="#">Artistas</a></li>
                            </ul>
                        </div>
                        <div className="col-6 col-md-2 mb-4 mb-md-0">
                            <h6 className="footer-title">Suporte</h6>
                            <ul className="footer-links-list">
                                <li><a href="#">Sobre Nós</a></li>
                                <li><a href="#">FAQ</a></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-4">
                            <h6 className="footer-title">Contato</h6>
                            <p className="contact-email">contato@galerialocal.com.br</p>
                        </div>
                    </div>
                    <div className="footer-bottom text-center py-3">
                        <p className="copyright">© 2024 Fibonacci. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;