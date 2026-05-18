import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/home.css'; // Reutilizando base elegante

function ProductDetail() {
    const { id } = useParams();
    const history = useHistory();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:8000/fibonacci/products/${id}/`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleBuyNow = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            
            history.push(`/login?redirect=product/${id}`);
        } else {
            
            history.push('/cart');
        }
    };

    if (loading) return <div className="container mt-5">Carregando obra...</div>;
    if (!product) return <div className="container mt-5">Obra não encontrada.</div>;

    return (
        <div className="container mt-5 pt-5 animate-fade-in">
            <div className="row">
                <div className="col-md-6">
                    <img 
                        src={`http://127.0.0.1:8000${product.image}`} 
                        alt={product.name} 
                        className="img-fluid shadow-sm"
                        style={{ borderRadius: '4px', width: '100%', maxHeight: '600px', objectFit: 'cover' }}
                    />
                </div>
                <div className="col-md-6 pl-md-5 mt-4 mt-md-0">
                    <small className="text-muted text-uppercase letter-spacing-2">{product.category_name || 'Obra Única'}</small>
                    <h1 className="display-4 font-weight-bold mb-3" style={{ fontFamily: 'Playfair Display' }}>{product.name}</h1>
                    <p className="h4 mb-4 text-sepia" style={{ color: '#5D4037' }}>R$ {product.price}</p>
                    
                    <div className="border-top border-bottom py-4 mb-4">
                        <p className="text-muted mb-1">Artista</p>
                        <p className="font-weight-bold h5">{product.brand || 'Artista Local'}</p>
                    </div>

                    <p className="text-muted mb-5" style={{ lineHeight: '1.8' }}>
                        {product.description || 'Esta obra exclusiva representa a essência da arte local produzida com técnicas tradicionais e visão contemporânea.'}
                    </p>

                    <div className="d-grid gap-2">
                        <button 
                            onClick={handleBuyNow}
                            className="btn-fibonacci py-3 text-uppercase font-weight-bold"
                            style={{ background: '#1A1A1A', color: '#fff', border: 'none', letterSpacing: '2px' }}
                        >
                            Comprar Agora
                        </button>
                        <Link to="/galeria" className="text-center mt-3 text-dark text-decoration-none small font-weight-bold">
                            ← VOLTAR PARA A GALERIA
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;