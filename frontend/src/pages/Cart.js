import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/cart.css';

function Cart() {
   
    const [cartItems, setCartItems] = useState([
        {
            _id: 1,
            name: "A Surpresa",
            brand: "Jean-Antoine Watteau",
            price: 2800.00,
            image: "https://upload.wikimedia.org/wikipedia/commons/4/40/Jean-Antoine_Watteau_La_Surprise%2C_oil_on_panel.jpg",
            qty: 1
        },
        {
            _id: 2,
            name: "O Balanço",
            brand: "Jean-Honoré Fragonard",
            price: 1500.00,
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Fragonard%2C_The_Swing.jpg/960px-Fragonard%2C_The_Swing.jpg",
            qty: 1
        }
    ]);

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems(cartItems.map(item => item._id === id ? { ...item, qty: newQty } : item));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item._id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shippingPrice = subtotal > 2000 ? 0 : 150.00; 
    const total = subtotal + shippingPrice;

    return (
        <div className="cart-page animate-fade-in">
            <div className="container">
                <h1 className="cart-title">Carrinho de Compras</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-shopping-bag mb-3 text-muted" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                        <h3 style={{ fontFamily: 'Playfair Display' }}>Seu carrinho está vazio</h3>
                        <p className="text-muted">Explore nossa galeria para encontrar obras exclusivas.</p>
                        <Link to="/galeria" className="btn-primary-custom mt-3">Voltar à Galeria</Link>
                    </div>
                ) : (
                    <div className="row g-5">
                        {/* Coluna da Esquerda: Lista de Produtos */}
                        <div className="col-lg-8">
                            <div className="cart-items-list">
                                {cartItems.map(item => (
                                    <div className="cart-item-row" key={item._id}>
                                        <img src={item.image} alt={item.name} className="cart-item-image" />
                                        
                                        <div className="cart-item-details">
                                            <Link to={`/product/${item._id}`} className="cart-item-name">
                                                {item.name}
                                            </Link>
                                            <p className="cart-item-artist">{item.brand}</p>
                                        </div>

                                        {/* Seletor de Quantidade Incremental */}
                                        <div className="cart-item-qty-wrapper">
                                            <button className="cart-qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
                                            <span className="cart-qty-input">{item.qty}</span>
                                            <button className="cart-qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                                        </div>

                                        <p className="cart-item-price">
                                            R$ {(item.price * item.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>

                                        <button className="btn-remove-item" onClick={() => removeItem(item._id)} title="Remover item">
                                            <i className="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Link to="/galeria" className="btn-continue-shopping">
                                ← Continuar Comprando
                            </Link>
                        </div>

                        {/* Coluna da Direita: Painel Fixo de Resumo */}
                        <div className="col-lg-4">
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
                                    <small className="text-muted d-block mb-3" style={{ fontSize: '0.75rem', marginTop: '-10px' }}>
                                        * Frete grátis para compras acima de R$ 2.000,00
                                    </small>
                                )}
                                
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <button className="btn-checkout">
                                    Fechar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;