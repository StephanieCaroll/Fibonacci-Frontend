import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/cart.css';

function Cart() {
    const history = useHistory();
    const [cartItems, setCartItems] = useState([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
       
        window.dispatchEvent(new Event('storage'));
    }, [cartItems]);

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        const product = cartItems.find(item => (item._id || item.id) === id);
        if (product && newQty > product.countInstock) {
            alert(`Estoque máximo disponível: ${product.countInstock} unidades`);
            return;
        }
        setCartItems(cartItems.map(item => 
            (item._id || item.id) === id ? { ...item, qty: newQty } : item
        ));
    };

    const openRemoveModal = (id, name) => {
        setItemToRemove({ id, name });
        setShowRemoveModal(true);
    };

    const confirmRemove = () => {
        if (itemToRemove) {
            setCartItems(cartItems.filter(item => (item._id || item.id) !== itemToRemove.id));
        }
        setShowRemoveModal(false);
        setItemToRemove(null);
    };

    const cancelRemove = () => {
        setShowRemoveModal(false);
        setItemToRemove(null);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shippingPrice = subtotal > 2000 ? 0 : 150.00;
    const total = subtotal + shippingPrice;

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            alert('Você precisa estar logado para finalizar a compra.');
            history.push('/login');
            return;
        }

        setIsCheckingOut(true);

        const orderItems = cartItems.map(item => ({
            product: item._id || item.id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image
        }));

        const orderData = {
            orderItems: orderItems,
            paymentMethod: 'Cartão',
            shippingAddress: {
                address: 'Endereço Padrão',
                city: 'Recife',
                postalCode: '50000-000',
                country: 'Brasil'
            },
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: shippingPrice,
            totalPrice: total
        };

        try {
            const token = userInfo.token || userInfo.access;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.post(
                'http://127.0.0.1:8000/fibonacci/orders/add/',
                orderData,
                config
            );

            localStorage.removeItem('cart');
            setCartItems([]);
            window.dispatchEvent(new Event('storage'));
            
            setOrderDetails({
                orderId: response.data._id || response.data.id,
                totalAmount: total,
                itemsCount: cartItems.length,
                items: cartItems,
                date: new Date().toLocaleDateString('pt-BR')
            });
            
            setShowSuccessModal(true);
            
        } catch (error) {
            console.error('Erro no checkout:', error);
            let errorMsg = 'Erro ao processar compra. ';
            if (error.response?.data?.detail) {
                errorMsg += error.response.data.detail;
            } else {
                errorMsg += 'Tente novamente mais tarde.';
            }
            alert(errorMsg);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        history.push('/perfil');
    };

    return (
        <div className="cart-page animate-fade-in">
            <div className="container">
                <h1 className="cart-title">Carrinho de Compras</h1>

                {cartItems.length === 0 && !showSuccessModal ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <i className="fas fa-shopping-bag"></i>
                        </div>
                        <h3>Seu carrinho está vazio</h3>
                        <p>Explore nossa galeria para encontrar obras exclusivas.</p>
                        <Link to="/galeria" className="btn-primary-custom">Voltar à Galeria</Link>
                    </div>
                ) : (
                    <div className="cart-grid">
                        <div className="cart-items-column">
                            <div className="cart-items-header">
                                <span>Produto</span>
                                <span>Quantidade</span>
                                <span>Subtotal</span>
                                <span></span>
                            </div>
                            
                            <div className="cart-items-list">
                                {cartItems.map(item => (
                                    <div className="cart-item-card" key={item._id || item.id}>
                                        <div className="cart-item-image-wrapper">
                                            <img 
                                                src={item.image && item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} 
                                                alt={item.name} 
                                                className="cart-item-image" 
                                            />
                                        </div>
                                        
                                        <div className="cart-item-info">
                                            <Link to={`/product/${item._id || item.id}`} className="cart-item-name">
                                                {item.name}
                                            </Link>
                                            <p className="cart-item-artist">{item.brand || "Artista Local"}</p>
                                            <p className="cart-item-price-mobile">
                                                R$ {((item.price || 0) * (item.qty || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        <div className="cart-item-quantity">
                                            <button 
                                                className="cart-qty-btn" 
                                                onClick={() => updateQty(item._id || item.id, (item.qty || 1) - 1)}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span className="cart-qty-value">{item.qty || 1}</span>
                                            <button 
                                                className="cart-qty-btn" 
                                                onClick={() => updateQty(item._id || item.id, (item.qty || 1) + 1)}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>

                                        <div className="cart-item-subtotal">
                                            R$ {((item.price || 0) * (item.qty || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>

                                        <button 
                                            className="cart-item-remove" 
                                            onClick={() => openRemoveModal(item._id || item.id, item.name)}
                                            title="Remover item"
                                        >
                                            <i className="far fa-trash-alt"></i>
                                            <span className="remove-text">Remover</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <Link to="/galeria" className="btn-continue-shopping">
                                <i className="fas fa-arrow-left"></i> Continuar Comprando
                            </Link>
                        </div>

                        <div className="cart-summary-column">
                            <div className="cart-summary-card">
                                <h2 className="summary-title">Resumo do Pedido</h2>
                                
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                
                                <div className="summary-row">
                                    <span>Frete</span>
                                    <span>{shippingPrice === 0 ? "Grátis" : `R$ ${shippingPrice.toFixed(2)}`}</span>
                                </div>

                                {shippingPrice > 0 && (
                                    <small className="shipping-info">
                                        <i className="fas fa-truck"></i> Frete grátis para compras acima de R$ 2.000,00
                                    </small>
                                )}
                                
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <button 
                                    className="btn-checkout" 
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? (
                                        <><i className="fas fa-spinner fa-spin"></i> PROCESSANDO...</>
                                    ) : (
                                        <><i className="fas fa-credit-card"></i> FINALIZAR PEDIDO</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showRemoveModal && (
                <div className="remove-modal-overlay">
                    <div className="remove-modal-content animate-pop-in">
                        <div className="remove-modal-icon">
                            <i className="fas fa-trash-alt"></i>
                        </div>
                        <h2 className="remove-modal-title">Remover Item</h2>
                        <p className="remove-modal-message">
                            Tem certeza que deseja remover <strong>"{itemToRemove?.name}"</strong> do seu carrinho?
                        </p>
                        <div className="remove-modal-buttons">
                            <button className="remove-modal-btn cancel" onClick={cancelRemove}>
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                            <button className="remove-modal-btn confirm" onClick={confirmRemove}>
                                <i className="fas fa-check"></i> Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && orderDetails && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content animate-pop-in">
                        <div className="success-modal-icon">
                            <div className="success-animation">
                                <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                    <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                    <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                        </div>
                        
                        <h2 className="success-modal-title">Compra Finalizada!</h2>
                        
                        <p className="success-modal-message">
                            Sua compra foi processada com sucesso. Você já pode visualizar suas obras adquiridas no seu perfil.
                        </p>
                        
                        <div className="success-order-info">
                            <div className="success-order-row">
                                <span><i className="fas fa-hashtag"></i> Número do Pedido</span>
                                <strong>#{String(orderDetails.orderId).slice(-8)}</strong>
                            </div>
                            <div className="success-order-row">
                                <span><i className="fas fa-calendar-alt"></i> Data</span>
                                <strong>{orderDetails.date}</strong>
                            </div>
                            <div className="success-order-row">
                                <span><i className="fas fa-boxes"></i> Itens</span>
                                <strong>{orderDetails.itemsCount} {orderDetails.itemsCount === 1 ? 'obra' : 'obras'}</strong>
                            </div>
                            <div className="success-order-row total">
                                <span><i className="fas fa-tag"></i> Valor Total</span>
                                <strong>R$ {orderDetails.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                            </div>
                        </div>
                        
                        <div className="success-items-preview">
                            <p className="preview-title"><i className="fas fa-palette"></i> Obras adquiridas:</p>
                            <div className="preview-items">
                                {orderDetails.items.slice(0, 3).map((item, index) => (
                                    <div key={index} className="preview-item">
                                        <span>{item.name}</span>
                                        <span>x{item.qty}</span>
                                    </div>
                                ))}
                                {orderDetails.items.length > 3 && (
                                    <div className="preview-more">
                                        +{orderDetails.items.length - 3} {orderDetails.items.length - 3 === 1 ? 'obra' : 'obras'}...
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="success-modal-buttons">
                            <button className="success-modal-btn primary" onClick={closeSuccessModal}>
                                <i className="fas fa-user"></i> Ver Meu Perfil
                            </button>
                            <button className="success-modal-btn secondary" onClick={() => {
                                setShowSuccessModal(false);
                                history.push('/galeria');
                            }}>
                                <i className="fas fa-store"></i> Continuar Explorando
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;