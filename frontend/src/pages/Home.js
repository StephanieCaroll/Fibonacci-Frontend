import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                // Chamando o seu endpoint: path('top/', views.getTopProducts, name="top-products")
                const { data } = await axios.get('http://127.0.0.1:8000/api/products/top/');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar produtos do back-end:", error);
                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    return (
        <div className="home-container">
            {/* Seção Hero */}
            <div className="container hero-section">
                <div className="row align-items-center">
                    <div className="col-12 col-md-5 text-center text-md-left mb-4">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Fragonard%2C_The_Reader.jpg/960px-Fragonard%2C_The_Reader.jpg" 
                            className="hero-img shadow-sm" 
                            alt="Fibonacci Hero" 
                        />
                    </div>
                    <div className="col-12 col-md-7 pl-md-5">
                        <h1 className="hero-title">Arte local,<br className="d-none d-md-block" />alma única</h1>
                        <p className="hero-text">
                            Descubra obras originais de artistas da sua região. Cada peça carrega uma história e a paixão de quem cria com o coração.
                        </p>
                        <div className="button-group">
                            <Link to="/galeria" className="btn btn-outline-custom">Explorar Galeria →</Link>
                            <button className="btn btn-outline-custom">Sou Artista</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de Obras Recentes puxadas do Django */}
            <div className="container mb-5">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <small className="text-muted text-uppercase" style={{ letterSpacing: '2px' }}>Destaques</small>
                        <h2 className="font-weight-bold">Obras em Destaque</h2>
                    </div>
                    <Link to="/galeria" className="text-dark small font-weight-bold">VER TODAS →</Link>
                </div>

                {loading ? (
                    <p>Carregando destaques...</p>
                ) : (
                    <div className="row">
                        {products.map(product => (
                            <div key={product._id} className="col-12 col-sm-6 col-lg-3 mb-4">
                                <div className="card-obra">
                                    <span className="badge-categoria">{product.category || 'ARTE'}</span>
                                    <img src={product.image} className="obra-img" alt={product.name} />
                                    <div className="pt-3">
                                        <h6 className="mb-0 font-weight-bold">{product.name.toUpperCase()}</h6>
                                        <small className="text-muted">R$ {product.price}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;