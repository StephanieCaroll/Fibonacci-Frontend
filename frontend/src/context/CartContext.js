import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const getItemId = (item) => String(item._id || item.id);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const productId = getItemId(product);
            const quantityToAdd = product.qty || 1;
            const exists = prevItems.find((item) => getItemId(item) === productId);

            if (exists) {
                return prevItems.map((item) =>
                    getItemId(item) === productId ? { ...item, qty: (item.qty || 1) + quantityToAdd } : item
                );
            }

            return [...prevItems, { ...product, qty: quantityToAdd }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => getItemId(item) !== String(productId)));
    };

    const updateQuantity = (productId, qty) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                getItemId(item) === String(productId) ? { ...item, qty } : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
