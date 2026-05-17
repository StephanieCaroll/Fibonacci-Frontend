import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                
                const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/products/');
                // Exibe apenas as 4 obras mais recentes na Home
                setProducts(data.products.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="animate-fade-in">
       
            <div className="container hero-section">
                <div className="row align-items-center">
                    <div className="col-12 col-md-5 text-center text-md-left mb-4 mb-md-0">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Fragonard%2C_The_Reader.jpg/960px-Fragonard%2C_The_Reader.jpg" 
                            className="hero-img shadow-sm" 
                            alt="Arte Hero"
                        />
                    </div>
                    <div className="col-12 col-md-7 pl-md-5">
                        <h1 className="hero-title">Arte local,<br className="d-none d-md-block" />alma única</h1>
                        <p className="hero-text">
                            Descubra obras originais de artistas da sua região. Cada peça carrega uma história, um olhar e a paixão de quem cria com o coração.
                        </p>
                        <div className="button-group">
                            <Link to="/galeria" className="btn btn-outline-custom">Explorar Galeria →</Link>
                            <button className="btn btn-outline-custom">Sou Artista</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Obras Recentes - Dinâmico */}
            <div className="container mb-5">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end mb-4">
                    <div className="mb-2 mb-sm-0">
                        <small className="text-muted text-uppercase" style={{ letterSpacing: '2px' }}>Coleção</small>
                        <h2 className="font-weight-bold">Obras Recentes</h2>
                    </div>
                    <Link to="/galeria" className="text-dark small font-weight-bold">VER TODAS →</Link>
                </div>

                <div className="row">
                    {loading ? (
                        <p className="col-12 text-center">Carregando obras...</p>
                    ) : (
                        products.map((product) => (
                            <div className="col-12 col-sm-6 col-lg-3 mb-4" key={product._id}>
                                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card-obra">
                                        {/* Badge dinâmico baseado na categoria do teu models.py */}
                                        <span className="badge-categoria">
                                            {product.category_name ? product.category_name.toUpperCase() : 'ARTE'}
                                        </span>
                                        <img 
                                            src={`http://127.0.0.1:8000${product.image}`} 
                                            className="obra-img" 
                                            alt={product.name} 
                                        />
                                        <div className="pt-3">
                                            <h6 className="mb-0 font-weight-bold">{product.name?.toUpperCase()}</h6>
                                            <small className="text-muted">{product.brand || 'Artista Independente'}</small>
                                            <p className="font-weight-bold mt-1">R$ {product.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;