import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5253/api/auth', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(response.data);
                console.log(response);
            } catch (error) {
                console.error('Ошибка при получении профиля', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (!profile) return <div>Данные профиля не найдены</div>;

    return (
        <div className="profile-container">
            <h1>{profile.fullName}</h1>
            <p>Электронная почта: {profile.email}</p>
            <p>Номер телефона: {profile.phoneNumber}</p>
            <h2>Заказы</h2>
            <ul>
                {profile.orders.map(order => (
                    <li key={order.id}>
                        <h3>Номер заказа: {order.id}</h3>
                        <p>Дата заказа: {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p>Общая сумма: {order.totalAmount} ₸</p>
                        <p>Имя покупателя: {order.customerName}</p>
                        <p>Телефон покупателя: {order.customerPhone}</p>
                        <p>Адрес: {order.address}</p>
                        {order.comment && <p>Комментарий: {order.comment}</p>}
                        <h4>Товары в заказе</h4>
                        <ul className="order-items">
                            {order.orderItems.map(item => (
                                <li key={item.productId}>
                                    Товар: {item.productName}, Количество: {item.quantity}, Цена: {item.unitPrice} ₸
                                </li>
                            ))}
                        </ul>
                        <p className="order-total">Итого: {order.totalAmount} ₸</p> {/* Итоговая сумма */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfile;
