import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import '../styles/home.css';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        let isMounted = true; 

        async function fetchProducts() {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = userInfo ? {
                    headers: { Authorization: `Bearer ${userInfo.token || userInfo.access}` }
                } : {};

                const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/products/', config);
                
                const productsData = data.products ? data.products : data;
                const productsArray = Array.isArray(productsData) ? productsData : [];

                const recentProducts = productsArray
                    .sort((a, b) => (b.id || b._id) - (a.id || a._id))
                    .slice(0, 4);

                if (isMounted) {
                    setProducts(recentProducts);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao carregar obras:", error);
                    setLoading(false);
                }
            }
        }
        
        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCardClick = (id) => {
        history.push(`/product/${id}`);
    };

    const getCategoryDisplay = (product) => {
        const cat = product.category_name || product.category;
        if (!cat) return 'Arte';
        
        const catString = String(cat);
        if (catString.toLowerCase() === 'digital') return 'Arte Digital';
        return catString;
    };

    return (
        <div className="home-page animate-fade-in">
          
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

            <main className="container pb-5">
                <div className="section-header d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Obras Recentes</h2>
                    <Link to="/galeria" className="text-dark small font-weight-bold text-decoration-none">VER TUDO →</Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <h5 className="text-muted">Carregando acervo...</h5>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                        {products.map((product) => (
                            <div className="col mb-4" key={product.id || product._id}>
                                <div 
                                    className="card-obra" 
                                    onClick={() => handleCardClick(product.id || product._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="badge-categoria text-uppercase">
                                        {getCategoryDisplay(product)}
                                    </span>
                                    
                                    <div className="img-container">
                                        <img 
                                            src={product.image && product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                                            className="obra-img" 
                                            alt={product.name} 
                                        />
                                    </div>

                                    <div className="pt-3">
                                        <h6 className="mb-0 font-weight-bold text-uppercase nome-obra">{product.name}</h6>
                                        <small className="text-muted artista-obra">{product.brand || 'Artista Independente'}</small>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <p className="font-weight-bold mb-0 price-text">R$ {product.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;