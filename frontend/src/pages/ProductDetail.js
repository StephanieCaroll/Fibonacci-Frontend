import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/productDetail.css';


function ProductDetail() {
    const { id } = useParams();
    const history = useHistory();
    const { addToCart } = useContext(CartContext);
    const [rating, setRating] = useState(0);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [comment, setComment] = useState(''); 
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
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

    const getCategoryDisplay = (product) => {
        if (!product) return 'Arte';
        
        let cat = '';
        
        if (product.category_name && product.category_name !== 'Arte') {
            cat = product.category_name;
        } else if (product.category && typeof product.category === 'object' && product.category.name) {
            cat = product.category.name;
        } else if (product.category && typeof product.category === 'string' && isNaN(Number(product.category))) {
            cat = product.category;
        }

        if (!cat) return 'Arte';

        const catString = String(cat);
        if (catString.toLowerCase() === 'digital') return 'Arte Digital';
        
        return catString.charAt(0).toUpperCase() + catString.slice(1);
    };

    const getGenreDisplay = (desc) => {
        if (!desc) return 'Arte Exclusiva';
        
        const match = desc.match(/Gênero:\s*([^.]+)/i);
        if (match && match[1]) {
            const genre = match[1].trim();
            return genre.charAt(0).toUpperCase() + genre.slice(1);
        }
        
        return 'Arte Exclusiva'; 
    };

    const stockQuantity = product?.countInstock || 0;
    const isOutOfStock = stockQuantity === 0;
    
    const productOwnerId = product?.user?._id || product?.user?.id || product?.user;
    const currentUserId = userInfo?.id || userInfo?._id;
    const isOwner = currentUserId && productOwnerId && String(currentUserId) === String(productOwnerId);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= stockQuantity) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (isOutOfStock) {
            alert('Produto esgotado!');
            return;
        }

        if (isOwner) {
            alert('Você não pode comprar sua própria obra de arte.');
            return;
        }

        if (!userInfo) {
            alert("Você precisa estar logado para adicionar ao carrinho.");
            history.push('/login');
            return;
        }

        setIsAddingToCart(true);

        // CHAMADA DO CONTEXTO:
        addToCart({
            _id: product._id || product.id,
            id: product._id || product.id,
            name: product.name,
            brand: product.brand || "Artista Local",
            price: Number(product.price),
            image: product.image,
            qty: quantity,
            countInstock: product.countInstock
        });
        
        const imageUrl = product.image && product.image.startsWith('http') 
            ? product.image 
            : `http://127.0.0.1:8000${product.image}`;
        
        setAddedProduct({
            name: product.name,
            image: imageUrl,
            quantity: quantity,
            price: Number(product.price),
            artist: product.brand || "Artista Local"
        });
        
        setShowCartModal(true);
        setIsAddingToCart(false);
    };

    const closeCartModal = (goToCart = false) => {
        setShowCartModal(false);
        if (goToCart) {
            history.push('/cart'); 
        }
    };

    const getStockStatus = () => {
        if (stockQuantity === 0) {
            return { text: 'ESGOTADO', class: 'out-of-stock', color: '#E74C3C' };
        } else if (stockQuantity <= 5) {
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

    const imageUrl = product.image && product.image.startsWith('http') 
        ? product.image 
        : `http://127.0.0.1:8000${product.image}`;

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
    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.access || userInfo.token}`
                }
            };
            await axios.post(`http://127.0.0.1:8000/fibonacci/products/${id}/reviews/`, { rating, comment }, config);
            alert('Avaliação enviada com sucesso!');
            setShowReviewModal(false);
            window.location.reload(); 
        } catch (error) {
            alert('Erro ao enviar a avaliação. Verifique se você já avaliou esta obra');

        }
    };
    

    return (
        <div className="product-detail-container animate-fade-in">
            <button onClick={() => history.push('/galeria')} className="btn-back">
                ← Voltar à Coleção
            </button>

            <div className="product-layout">
                <div className="product-image-section">
                    <div className="product-image-wrapper" style={{ filter: isOutOfStock ? 'grayscale(1)' : 'none' }}>
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
                            <span>{getCategoryDisplay(product)}</span>
                        </div>
                        {isOutOfStock && <div className="sold-out-overlay">VENDIDO</div>}
                    </div>
                </div>

                <div className="product-info-section">
                    <div className="product-category-tag">
                        {getGenreDisplay(product.description)}
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
                                    {isOutOfStock ? '✕' : '✓'}
                                </span>
                                <span className="stock-status-text">{stockStatus.text}</span>
                            </div>
                            
                            <div className="stock-quantity-display">
                                <span className="stock-number">{stockQuantity}</span>
                                <span className="stock-label">
                                    {stockQuantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}
                                </span>
                            </div>
                            
                            {!isOutOfStock && stockQuantity <= 10 && (
                                <div className="stock-warning-message">
                                    <i className="fas fa-exclamation-triangle"></i> Apenas {stockQuantity} unidades em estoque!
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
                                    <p className="review-comment">{review.comment || 'Excelente obra!'}</p>
                                </div>
                            ))}
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
                    </div>

                    <div className="product-description-section">
                        <h3>Sobre a obra</h3>
                        <p>{product.description || "Esta peça única representa a convergência entre a matemática sagrada e a expressão artística Fibonacci."}</p>
                    </div>

                    {!isOutOfStock && !isOwner && (
                        <div className="quantity-selector">
                            <label>Quantidade</label>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => handleQuantityChange(-1)} 
                                    disabled={quantity <= 1}
                                    className="quantity-btn"
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)} 
                                    disabled={quantity >= stockQuantity}
                                    className="quantity-btn"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button 
                            onClick={handleAddToCart} 
                            className={`btn-add-to-cart ${isOutOfStock || isAddingToCart || isOwner ? 'disabled' : ''}`}
                            disabled={isOutOfStock || isAddingToCart || isOwner}
                            style={{
                                backgroundColor: isOwner ? '#666' : (isOutOfStock ? '#ccc' : ''),
                                cursor: (isOutOfStock || isOwner) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isAddingToCart ? (
                                <><i className="fas fa-spinner fa-spin"></i> ADICIONANDO...</>
                            ) : isOutOfStock ? (
                                'VENDIDO'
                            ) : isOwner ? (
                                'SUA PRÓPRIA OBRA'
                            ) : (
                                <><i className="fas fa-shopping-cart"></i> Adicionar ao Carrinho</>
                            )}
                        </button>
                    </div>

                    {isOwner && (
                        <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '10px' }}>
                            <i className="fas fa-info-circle"></i> Artistas não podem comprar suas próprias obras.
                        </p>
                    )}

                    <div className="extra-info">
                        <div className="info-item">
                            <i className="fas fa-certificate"></i>
                            <p>Certificado de Autenticidade Assinado</p>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-truck"></i>
                            <p>Frete grátis para todo Brasil</p>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-boxes"></i>
                            <p>Estoque atual: {stockQuantity} unidades</p>
                        </div>
                    </div>

                    <div className="share-section">
                        <p>Compartilhar:</p>
                        <div className="social-icons">
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-facebook"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-pinterest"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmação de Carrinho */}
            {showCartModal && addedProduct && (
                <div className="cart-modal-overlay">
                    <div className="cart-modal-content animate-pop-in">
                        {/* ... (todo o conteúdo original do seu modal de carrinho) ... */}
                        <div className="cart-modal-icon">
                            <div className="cart-success-animation">
                                <svg className="cart-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="cart-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="cart-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="cart-modal-title">Adicionado ao Carrinho</h2>
                        <div className="cart-art-preview">
                            <img src={addedProduct.image} alt={addedProduct.name} className="cart-art-image" />
                            <div className="cart-art-info">
                                <h3 className="cart-art-name">{addedProduct.name}</h3>
                                <p className="cart-art-artist">{addedProduct.artist}</p>
                                <div className="cart-art-details">
                                    <span><i className="fas fa-cube"></i> Quantidade: {addedProduct.quantity}</span>
                                    <span><i className="fas fa-tag"></i> {addedProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                        </div>
                        <div className="cart-message">
                            <p><i className="fas fa-check-circle"></i> A obra foi adicionada ao seu carrinho!</p>
                            <p className="cart-submessage">Você pode continuar comprando ou finalizar seu pedido agora.</p>
                        </div>
                        <div className="cart-buttons">
                            <button className="cart-btn-primary" onClick={() => closeCartModal(true)}>
                                <i className="fas fa-shopping-cart"></i> Ver Carrinho
                            </button>
                            <button className="cart-btn-secondary" onClick={() => closeCartModal(false)}>
                                <i className="fas fa-store"></i> Continuar Comprando
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Avaliação (Novo) */}
            {showReviewModal && (
                <div className="review-modal-overlay">
                    <div className="review-modal-content">
                        <h3>Avaliar Obra</h3>
                        <form onSubmit={submitReviewHandler}>
                            <label>Nota:</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                <option value={0}>Selecione...</option>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Estrelas</option>)}
                            </select>
                            <label>Comentário:</label>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                            <div className="modal-buttons">
                                <button type="submit">Enviar Avaliação</button>
                                <button type="button" onClick={() => setShowReviewModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div> // Esta é a última div do return
    );
}

export default ProductDetail;

