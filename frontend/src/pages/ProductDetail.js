import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import '../styles/productDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const history = useHistory();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = userInfo ? {
                    headers: { Authorization: `Bearer ${userInfo.access || userInfo.token}` }
                } : {};

                const { data } = await axios.get(`http://127.0.0.1:8000/fibonacci/products/${id}/`, config);
                
                console.log('Dados do produto:', data); 
                
                setProduct(data);
                
                if (data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews);
                    const avg = data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length;
                    setAverageRating(avg);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Erro na API:", err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta) => {
       
        const stock = product.countInstock || product.stock || 0;
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        const stock = product.countInstock || product.stock || 0;
        if (stock === 0) {
            alert('Produto esgotado!');
            return;
        }
        console.log(`Adicionando ${quantity} x ${product?.name}`);
    };

    const getStockStatus = () => {
      
        const stock = product.countInstock || product.stock || 0;
        
        if (stock === 0) {
            return { text: 'ESGOTADO', class: 'out-of-stock', color: '#E74C3C' };
        } else if (stock <= 5) {
            return { text: 'ESTOQUE BAIXO', class: 'low-stock', color: '#F39C12' };
        } else {
            return { text: 'EM ESTOQUE', class: 'in-stock', color: '#27AE60' };
        }
    };

    if (loading) return (
        <div className="product-detail-container">
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Despertando a obra...</p>
            </div>
        </div>
    );
    
    if (!product) return (
        <div className="product-detail-container">
            <div className="error-message">
                <p>Obra não encontrada no acervo.</p>
                <button onClick={() => history.push('/galeria')} className="btn-back">
                    ← Voltar à Coleção
                </button>
            </div>
        </div>
    );

    const stockQuantity = product.countInstock || product.stock || 0;
    const isOutOfStock = stockQuantity === 0;

    const imageUrl = product.image && product.image.startsWith('http') 
        ? product.image 
        : product.image 
            ? `http://127.0.0.1:8000${product.image}`
            : '/api/placeholder/600/800';

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '½'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    const stockStatus = getStockStatus();

    return (
        <div className="product-detail-container animate-fade-in">
            <button onClick={() => history.push('/galeria')} className="btn-back">
                ← Voltar à Coleção
            </button>

            <div className="product-layout">
                <div className="product-image-section">
                    <div className="product-image-wrapper">
                        {!imageError ? (
                            <img 
                                src={imageUrl} 
                                alt={product.name}
                                onError={() => setImageError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="image-placeholder">
                                <span>🎨</span>
                                <p>Imagem em curadoria</p>
                            </div>
                        )}
                        <div className="image-badge">
                            <span>Original</span>
                        </div>
                        {stockQuantity <= 5 && stockQuantity > 0 && (
                            <div className="stock-badge-image">
                                <span>Últimas {stockQuantity} unidades!</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="product-info-section">
                    <div className="product-category-tag">
                        {product.category_name || "Original Fibonacci"}
                    </div>
                    
                    <h1 className="product-name">{product.name}</h1>
                    
                    <div className="product-author">
                        <span className="author-label">Criação de</span>
                        <strong>{product.brand || "Artista Local"}</strong>
                    </div>

                    <div className="product-stock">
                        <div className={`stock-card ${stockStatus.class}`}>
                            <div className="stock-header">
                                <span className="stock-icon">
                                    {stockQuantity === 0 ? '❌' : '✓'}
                                </span>
                                <span className="stock-status-text">{stockStatus.text}</span>
                            </div>
                            
                            <div className="stock-quantity-display">
                                <span className="stock-number">{stockQuantity}</span>
                                <span className="stock-label">
                                    {stockQuantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}
                                </span>
                            </div>
                            
                            {stockQuantity > 0 && stockQuantity <= 10 && (
                                <div className="stock-warning-message">
                                    ⚡ Apenas {stockQuantity} {stockQuantity === 1 ? 'unidade' : 'unidades'} em estoque! Não perca essa oportunidade.
                                </div>
                            )}
                            
                            {stockQuantity === 0 && (
                                <div className="stock-soldout-message">
                                    🔴 Produto esgotado. Volte em breve!
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="product-rating">
                        <div className="stars">
                            {renderStars(averageRating)}
                        </div>
                        <span className="rating-text">
                            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} 
                            {reviews.length > 0 && ` (${reviews.length} ${reviews.length === 1 ? 'avaliação' : 'avaliações'})`}
                            {reviews.length === 0 && ' (Sem avaliações ainda)'}
                        </span>
                    </div>

                    {reviews.length > 0 && (
                        <div className="reviews-summary">
                            {reviews.slice(0, 2).map((review, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-header">
                                        <span className="review-author">{review.user_name || 'Comprador'}</span>
                                        <div className="review-stars">{renderStars(review.rating)}</div>
                                    </div>
                                    <p className="review-comment">{review.comment || 'Excelente obra, recomendo!'}</p>
                                </div>
                            ))}
                            {reviews.length > 2 && (
                                <button className="view-all-reviews">
                                    Ver todas as {reviews.length} avaliações
                                </button>
                            )}
                        </div>
                    )}

                    <div className="product-price-box">
                        <span className="price-label">Preço</span>
                        <div className="price-value">
                            {Number(product.price).toLocaleString('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                            })}
                        </div>
                        <div className="price-installments">
                            ou em até 12x de {(Number(product.price) / 12).toLocaleString('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                            })} sem juros
                        </div>
                    </div>

                    <div className="product-description-section">
                        <h3>Sobre a obra</h3>
                        <p>{product.description || "Esta peça única representa a convergência entre a matemática sagrada de Fibonacci e a expressão artística contemporânea. Cada detalhe foi cuidadosamente elaborado para proporcionar uma experiência estética singular."}</p>
                    </div>

                    {!isOutOfStock && (
                        <div className="quantity-selector">
                            <label>Quantidade</label>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => handleQuantityChange(-1)} 
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
                                >
                                    −
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)} 
                                    disabled={quantity >= stockQuantity}
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                            <div className="stock-info-text">
                                Máximo de {stockQuantity} unidades por compra
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button 
                            onClick={handleAddToCart} 
                            className={`btn-add-to-cart ${isOutOfStock ? 'disabled' : ''}`}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? 'ESGOTADO' : 'Adicionar à Coleção'}
                        </button>
                        {!isOutOfStock && (
                            <button className="btn-wishlist">
                                ♡ Favoritar
                            </button>
                        )}
                    </div>

                    <div className="extra-info">
                        <div className="info-item">
                            <span>✓</span>
                            <p>Certificado de Autenticidade Assinado</p>
                        </div>
                        <div className="info-item">
                            <span>✓</span>
                            <p>Frete grátis para todo Brasil</p>
                        </div>
                        <div className="info-item">
                            <span>✓</span>
                            <p>Garantia de 30 dias</p>
                        </div>
                        <div className="info-item">
                            <span>📦</span>
                            <p>Estoque atual: {stockQuantity} {stockQuantity === 1 ? 'unidade' : 'unidades'}</p>
                        </div>
                    </div>

                    <div className="share-section">
                        <p>Compartilhar:</p>
                        <div className="social-icons">
                            <span>📱</span>
                            <span>📘</span>
                            <span>📸</span>
                            <span>🐦</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;