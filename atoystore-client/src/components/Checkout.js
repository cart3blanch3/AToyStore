import React, { useState, useEffect } from 'react';
import { createOrder } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';
import { getCartItems, updateCartItemQuantity, removeCartItem, clearCart } from '../services/cartService';
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
    const { userId } = useAuth(); // Получаем userId из useAuth

    useEffect(() => {
        const fetchCartItems = () => {
            const items = getCartItems(); // Получаем товары из localStorage
            setCartItems(items);
        };
        fetchCartItems();
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        updateCartItemQuantity(id, newQuantity); // Обновляем количество в localStorage
    };

    const handleRemoveItem = (id) => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        removeCartItem(id); // Удаляем товар из localStorage
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError('Пользователь не авторизован.');
            return;
        }

        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        const order = {
            customerName,
            customerPhone,
            address,
            comment,
            userId, // Включаем userId в заказ
            orderItems: cartItems.map(item => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                unitPrice: item.price // Предполагаем, что у вас есть поле price
            }))
        };

        try {
            await createOrder(order, token); // Передаем токен вместе с заказом
            clearCart(); // Очищаем корзину после успешного оформления заказа
            setSuccessMessage('Ваш заказ был успешно оформлен! В ближайшее время с вами свяжется менеджер.');
            setCartItems([]); // Очищаем состояние корзины
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="customerPhone">Телефон:</label>
                    <input
                        type="tel"
                        id="customerPhone"
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="comment">Комментарий:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}
                {successMessage && <p>{successMessage}</p>}
                <button type="submit">Оформить заказ</button>
            </form>
        </div>
    );
};

export default Checkout;
