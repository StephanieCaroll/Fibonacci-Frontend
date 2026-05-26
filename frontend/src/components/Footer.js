import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

function Footer() {
    return (
        <>

            <section className="features-bar">
                <div className="features-wrapper">
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect>
                                <path d="M12 8v-4"></path>
                                <path d="M8 4h8"></path>
                                <path d="M10 14l2 2 4-4"></path>
                            </svg>
                        </div>
                        <div className="feature-text">
                            <span className="feature-title">Apoie artistas locais</span>
                            <span className="feature-subtitle">Sua compra transforma vidas.</span>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="7"></circle>
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                                <circle cx="12" cy="8" r="3"></circle>
                            </svg>
                        </div>
                        <div className="feature-text">
                            <span className="feature-title">Obras originais</span>
                            <span className="feature-subtitle">Peças únicas e autênticadas.</span>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                <polyline points="12 14 12 16"></polyline>
                            </svg>
                        </div>
                        <div className="feature-text">
                            <span className="feature-title">Compra segura</span>
                            <span className="feature-subtitle">Seus dados sempre protegidos.</span>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                <circle cx="12" cy="13" r="1"></circle>
                                <path d="M12 17v-4"></path>
                            </svg>
                        </div>
                        <div className="feature-text">
                            <span className="feature-title">Atendimento humano</span>
                            <span className="feature-subtitle">Conte com a gente.</span>
                        </div>
                    </div>

                </div>
            </section>

            <footer className="main-footer">
                <div className="footer-wrapper">
                    
                    <div className="footer-col newsletter-col">
                        <h6 className="footer-title">RECEBA NOVIDADES</h6>
                        <p className="footer-text">
                            Assine nossa newsletter e receba<br />
                            lançamentos e conteúdos exclusivos.
                        </p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Seu melhor e-mail" required />
                            <button type="submit">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </form>
                        <h3 className="footer-logo">FIBONACCI</h3>
                    </div>

                    <div className="footer-col links-col">
                        <h6 className="footer-title">NAVEGAÇÃO</h6>
                        <ul className="footer-links-list">
                            <li><Link to="/galeria">Galeria</Link></li>
                            <li><Link to="/artistas">Artistas</Link></li>
                            <li><Link to="/sobre">Sobre</Link></li>
                            <li><Link to="/contato">Contato</Link></li>
                            <li><Link to="/faq">Perguntas frequentes</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col links-col">
                        <h6 className="footer-title">INFORMAÇÕES</h6>
                        <ul className="footer-links-list">
                            <li><Link to="/privacidade">Política de Privacidade</Link></li>
                            <li><Link to="/termos">Termos de Uso</Link></li>
                            <li><Link to="/trocas">Trocas e Devoluções</Link></li>
                            <li><Link to="/envios">Envios</Link></li>
                            <li><Link to="/seguranca">Segurança</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col social-col">
                        <h6 className="footer-title">SIGA-NOS</h6>
                        <div className="social-icons">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z"/></svg>
                            </a>
                            <a href="#" target="_blank" rel="noreferrer" aria-label="Outros">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                            </a>
                        </div>
                        <p className="footer-copyright">
                            © 2025 Fibonacci. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;