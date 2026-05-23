import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import '../styles/home.css';
import HomeCarousel from '../components/HomeCarousel';
import HomeBanner from '../components/HomeBanner'; 
import ArtistSection from '../components/ArtistSection'; 

function Home() {
    const [featured, setFeatured] = useState([]);
    const [paintings, setPaintings] = useState([]);
    const [sculptures, setSculptures] = useState([]);
    const [photography, setPhotography] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        let isMounted = true; 

        async function fetchProducts() {
            setLoading(true);
            try {
                const [featRes, paintRes, sculpRes, photoRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/products/featured/'),
                    axios.get('http://127.0.0.1:8000/api/products/category/Pintura/'),
                    axios.get('http://127.0.0.1:8000/api/products/category/Escultura/'),
                    axios.get('http://127.0.0.1:8000/api/products/category/Fotografia/')
                ]);

                if (isMounted) {
                    setFeatured(featRes.data);
                    setPaintings(paintRes.data);
                    setSculptures(sculpRes.data);
                    setPhotography(photoRes.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erro ao carregar:", error);
                if (isMounted) setLoading(false);
            }
        }
        
        fetchProducts();
        return () => { isMounted = false; };
    }, []);

    const handleCardClick = (id) => { history.push(`/product/${id}`); };

    const renderProducts = (productsArray) => {
        if (!productsArray || productsArray.length === 0) return <p className="text-muted ml-3">Nenhuma obra nesta categoria.</p>;
        
        return (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                {productsArray.map((product) => (
                    <div className="col mb-4" key={product.id || product._id}>
                        <div className="card-obra" onClick={() => handleCardClick(product.id || product._id)} style={{ cursor: 'pointer' }}>
                            <span className="badge-categoria text-uppercase">{product.category_name || 'Arte'}</span>
                            <div className="img-container">
                                {product.image && (
                                    <img 
                                        src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                                        className="obra-img" 
                                        alt={product.name} 
                                    />
                                )}
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
        );
    };

    return (
        <div className="home-page animate-fade-in">
            <HomeCarousel />

            <main className="container pb-5">
                {loading ? (
                    <div className="text-center py-5"><h5>Carregando curadoria...</h5></div>
                ) : (
                    <>
                        <h2 className="mb-4">Destaques da Semana</h2>
                        {renderProducts(featured)}
                        
                        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
                            <h2 className="mb-0">Pinturas</h2>
                            <Link to="/galeria?categoria=Pintura" className="text-dark font-weight-bold text-decoration-none">VER TUDO →</Link>
                        </div>
                        {renderProducts(paintings)}
                        
                        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
                            <h2 className="mb-0">Esculturas</h2>
                            <Link to="/galeria?categoria=Escultura" className="text-dark font-weight-bold text-decoration-none">VER TUDO →</Link>
                        </div>
                        {renderProducts(sculptures)}

                        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
                            <h2 className="mb-0">Fotografia</h2>
                            <Link to="/galeria?categoria=Fotografia" className="text-dark font-weight-bold text-decoration-none">VER TUDO →</Link>
                        </div>
                        {renderProducts(photography)}
                    </>
                )}
            </main>

            <HomeBanner />
            <ArtistSection /> {}
        </div>
    );
}

export default Home;