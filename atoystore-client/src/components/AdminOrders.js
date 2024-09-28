import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { deleteOrder, updateOrder } from '../services/orderService';
import Modal from './Modal'; 
import OrderForm from './OrderForm'; 

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5253/api/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Ошибка при получении заказов', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Загрузка...</div>;

    const calculateTotal = (orderItems) => {
        return orderItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    };

    const handleDeleteOrder = async () => {
        const token = localStorage.getItem('token');
        try {
            await deleteOrder(selectedOrder.id, token);
            setOrders(orders.filter(order => order.id !== selectedOrder.id)); 
        } catch (error) {
            alert('Ошибка при удалении заказа.');
        } finally {
            setIsDeleteModalOpen(false); 
            setSelectedOrder(null); 
        }
    };

    const confirmDelete = (order) => {
        setSelectedOrder(order);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedOrder(null); 
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleSaveOrder = async (updatedOrder) => {
        try {
            await updateOrder(updatedOrder.id, updatedOrder);
            setOrders(orders.map(order => (order.id === updatedOrder.id ? updatedOrder : order))); 
        } catch (error) {
        } finally {
            setIsEditModalOpen(false); 
            setSelectedOrder(null); 
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedOrder(null); 
    };

    return (
        <div>
            <h1>Заказы пользователей</h1>
            {orders.length === 0 ? (
                <p>Нет доступных заказов.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID заказа</th>
                            <th>Дата заказа</th>
                            <th>Сумма</th>
                            <th>Имя клиента</th>
                            <th>Телефон клиента</th>
                            <th>Адрес</th>
                            <th>Комментарий</th>
                            <th>Товары</th>
                            <th>Итого</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.totalAmount} ₸</td>
                                <td>{order.customerName}</td>
                                <td>{order.customerPhone}</td>
                                <td>{order.address}</td>
                                <td>{order.comment || 'Нет комментариев'}</td>
                                <td>
                                    <ul>
                                        {order.orderItems.map(item => (
                                            <li key={item.productId}>
                                                {item.productName}, Количество: {item.quantity}, Цена: {item.unitPrice} ₸
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>{calculateTotal(order.orderItems)} ₸</td>
                                <td>
                                    <button onClick={() => handleEditOrder(order)}>Редактировать</button>
                                    <button onClick={() => confirmDelete(order)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                <h2>Подтверждение удаления</h2>
                <p>Вы уверены, что хотите удалить заказ ID {selectedOrder?.id}?</p>
                <button onClick={handleDeleteOrder}>Да</button>
                <button onClick={handleCloseDeleteModal}>Нет</button>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                <h2>Редактировать заказ ID {selectedOrder?.id}</h2>
                <OrderForm order={selectedOrder} onSave={handleSaveOrder} />
            </Modal>
        </div>
    );
};

export default AdminOrders;
