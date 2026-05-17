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
                setProducts(data.products.slice(0, 8)); // Mostra 8 obras
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar obras:", error);
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="home-page animate-fade-in">
            {/* Hero Section Refinada */}
            <header className="hero-wrapper">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title">Arte Local,<br/>Alma Única.</h1>
                            <p className="hero-text">
                                Explore uma curadoria exclusiva de obras originais. Conectamos você ao talento de artistas locais com peças que contam histórias.
                            </p>
                            <Link to="/galeria" className="btn-fibonacci">Explorar Acervo</Link>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block">
                            <img 
                                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80" 
                                className="hero-image" 
                                alt="Destaque"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid de Obras */}
            <main className="container pb-5">
                <div className="section-header">
                    <h2>Obras Recentes</h2>
                    <Link to="/galeria" className="text-dark small font-weight-bold text-decoration-none">VER TUDO →</Link>
                </div>

                <div className="row">
                    {loading ? (
                        <p className="col-12 text-center text-muted py-5">Carregando acervo...</p>
                    ) : (
                        products.map((product) => (
                            <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                                <Link to={`/product/${product._id}`} className="art-card">
                                    <div className="image-container">
                                        <img 
                                            src={`http://127.0.0.1:8000${product.image}`} 
                                            alt={product.name} 
                                        />
                                    </div>
                                    <div className="art-details">
                                        <h3>{product.name}</h3>
                                        <p className="artist">{product.brand || 'Artista Independente'}</p>
                                        <p className="price">R$ {product.price}</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;