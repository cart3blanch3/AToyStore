import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';
import { getCartItems, updateCartItemQuantity, removeCartItem, clearCart } from '../services/cartService';
import InputMask from 'react-input-mask';
import './Checkout.css';

const API_BASE_URL = 'http://localhost:5253';

const Checkout = () => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchCartItems = () => {
            const items = getCartItems();
            setCartItems(items);
        };
        fetchCartItems();
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        updateCartItemQuantity(id, newQuantity);
    };

    const handleRemoveItem = (id) => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        removeCartItem(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError('Пользователь не авторизован.');
            return;
        }

        if (cartItems.length === 0) {
            setError('Корзина пуста. Добавьте товары перед оформлением заказа.');
            return;
        }

        const token = localStorage.getItem('token');

        const order = {
            customerName,
            customerPhone,
            address,
            comment,
            userId,
            orderItems: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                unitPrice: item.price
            }))
        };

        try {
            await createOrder(order, token);
            clearCart();
            setSuccessMessage('Ваш заказ был успешно оформлен! В ближайшее время с вами свяжется менеджер.');
            setCartItems([]);
            setError(null);  // Clear any previous errors on successful order
        } catch (err) {
            setError('Ошибка при оформлении заказа.');
        }
    };

    const calculateTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div>
            <h1>Оформление заказа</h1>

            <h2>Корзина</h2>
            {cartItems.length === 0 ? (
                <p>Ваша корзина пуста</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Изображение</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Итоговая стоимость</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td><img
                                    src={`${API_BASE_URL}${item.imageUrl}`}
                                    alt={item.name}
                                    className="cart-item-image"
                                /></td>
                                <td>{item.name}</td>
                                <td>{item.price} ₸</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                    />
                                </td>
                                <td>{item.price * item.quantity} ₸</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleRemoveItem(item.id)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <h3>Итоговая стоимость: {calculateTotalAmount()} ₸</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="customerName">Имя:</label>
                    <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        maxLength="100" // Limit name to 100 characters
                        required
                    />
                </div>
                <div>
                    <label htmlFor="customerPhone">Телефон:</label>
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        placeholder="+7 (7XX) XXX-XX-XX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="address">Адрес:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        maxLength="200" // Limit address to 200 characters
                        required
                    />
                </div>
                <div>
                    <label htmlFor="comment">Комментарий:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength="500" // Limit comment to 500 characters
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit" disabled={cartItems.length === 0}>Оформить заказ</button>
            </form>
        </div>
    );
};  

export default Checkout;
