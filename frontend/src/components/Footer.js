import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <>
      <section className="artist-invite">
        <div className="container">
          <div className="text-center">
            <h2 className="artist-title">Você é artista?</h2>
            <p className="artist-description">
              Mostre seu trabalho para o mundo. Cadastre suas obras gratuitamente e <br className="d-none d-md-block" />
              conecte-se com amantes da arte que valorizam criações autênticas.
            </p>
            <button className="btn-artist-cta">
              Começar a vender 
              <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <div className="footer-brand">
                <h3 className="footer-logo">FIBONACCI</h3>
                <p className="footer-description">
                  Conectando artistas locais e amantes da arte através de obras únicas e autênticas.
                </p>
                <div className="social-links">
                  <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="footer-title">Navegação</h6>
              <ul className="footer-links-list">
                <li><a href="/galeria">Galeria</a></li>
                <li><a href="/artistas">Artistas</a></li>
                <li><a href="/contato">Contato</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="footer-title">Suporte</h6>
              <ul className="footer-links-list">
                <li><a href="/sobre">Sobre Nós</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/termos">Termos</a></li>
              </ul>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="footer-title">Contato</h6>
              <p className="contact-email">
                <i className="far fa-envelope mr-2"></i> contato@galerialocal.com.br
              </p>
            </div>
          </div>
          <div className="footer-bottom text-center">
            <p className="copyright">© 2024 Fibonacci. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;