import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext'; // Импортируем CartContext
import { useAuthContext } from '../contexts/AuthContext'; // Импортируем AuthContext
import './CartDropdown.css'; 

const API_BASE_URL = 'http://localhost:5253'; 

const CartDropdown = () => {
    const { cartItems, handleRemoveCartItem } = useContext(CartContext); // Получаем корзину и функции
    const { isAuthenticated } = useAuthContext(); // Получаем состояние авторизации
    const [isOpen, setIsOpen] = useState(false);
    const cartRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="cart-dropdown" ref={cartRef}>
            <button className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
                🛒 <span className="item-count">{cartItems.length}</span>
            </button>

            {isOpen && (
                <div className="cart-dropdown-content">
                    {cartItems.length === 0 ? (
                        <p>Корзина пуста</p>
                    ) : (
                        <>
                            <ul>
                                {cartItems.map(item => (
                                    <li key={item.id} className="cart-item">
                                        <img 
                                            src={`${API_BASE_URL}${item.imageUrl}`} 
                                            alt={item.name} 
                                            className="cart-item-image" 
                                        />
                                        <div className="cart-item-details">
                                            <span className="cart-item-name">{item.name}</span>
                                            <span className="cart-item-price">{item.price} ₸</span>
                                            <span className="cart-item-quantity">x {item.quantity}</span>
                                        </div>
                                        <button className="remove-button" onClick={() => handleRemoveCartItem(item.id)}>Удалить</button>
                                    </li>
                                ))}
                            </ul>
                            {isAuthenticated ? (
                                <Link to="/checkout">
                                    <button className="checkout-button">Оформить заказ</button>
                                </Link>
                            ) : (
                                <p>Для оформления заказа необходимо авторизоваться.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartDropdown;
