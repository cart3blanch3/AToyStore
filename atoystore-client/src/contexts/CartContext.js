import React, { createContext, useState, useEffect } from 'react';
import { getCartItems, addToCart, removeCartItem, updateCartItemQuantity } from '../services/cartService';


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = getCartItems();
        setCartItems(items);
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);  
        const updatedCart = getCartItems(); 
        setCartItems(updatedCart); 
    };

    const handleRemoveCartItem = (id) => {
        removeCartItem(id);
        const updatedCart = getCartItems(); 
        setCartItems(updatedCart); 
    };

    const handleUpdateQuantity = (id, quantity) => {
        updateCartItemQuantity(id, quantity);
        const updatedCart = getCartItems(); 
        setCartItems(updatedCart); 
    };

    return (
        <CartContext.Provider value={{ cartItems, handleAddToCart, handleRemoveCartItem, handleUpdateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
