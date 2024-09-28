import React, { useState, useEffect } from 'react';
import { createOrder, updateOrder } from '../services/orderService'; 
import InputMask from 'react-input-mask';

const OrderForm = ({ order, onSave, token }) => {
    const [formData, setFormData] = useState({
        id: '',
        customerName: '',
        customerPhone: '',
        address: '',
        comment: '',
        orderItems: []
    });
    const [phoneError, setPhoneError] = useState('');

    useEffect(() => {
        if (order) {
            setFormData({
                id: order.id,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                address: order.address,
                comment: order.comment || '',
                orderItems: order.orderItems || []
            });
        }
    }, [order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleItemChange = (index, e) => {
        const updatedItems = [...formData.orderItems];
        updatedItems[index] = {
            ...updatedItems[index],
            quantity: e.target.value 
        };
        setFormData((prevData) => ({
            ...prevData,
            orderItems: updatedItems
        }));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = formData.orderItems.filter((_, i) => i !== index);
        setFormData((prevData) => ({
            ...prevData,
            orderItems: updatedItems
        }));
    };

    const handlePhoneChange = (e) => {
        const { value } = e.target;
        if (validatePhoneNumber(value)) {
            setPhoneError('');
            setFormData((prevData) => ({
                ...prevData,
                customerPhone: value
            }));
        } else {
            setPhoneError('Введите корректный номер телефона в формате +7 (7XX) XXX-XX-XX');
        }
    };

    const validatePhoneNumber = (number) => {
        const phonePattern = /^\+7 \(7\d{2}\) \d{3}-\d{2}-\d{2}$/;
        return phonePattern.test(number);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!phoneError && validatePhoneNumber(formData.customerPhone)) {
            try {
                if (formData.id) {
                    await updateOrder(formData.id, formData, token);
                } else {
                    await createOrder(formData, token);
                }
                onSave(); 
            } catch (error) {
                console.error(error);
            }
        } else {
            setPhoneError('Проверьте правильность введенного номера телефона.');
        }
    };

    return (
        <form onSubmit={handleSave}>
            <div>
                <label>Имя клиента:</label>
                <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    maxLength="50" 
                    required
                />
            </div>
            <div>
                <label>Телефон клиента:</label>
                <InputMask
                    mask="+7 (999) 999-99-99"
                    placeholder="+7 (7XX) XXX-XX-XX"
                    value={formData.customerPhone}
                    onChange={handlePhoneChange}
                    className="input"
                    required
                />
                {phoneError && <div className="error-message">{phoneError}</div>}
            </div>
            <div>
                <label>Адрес:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    maxLength="200" 
                    required
                />
            </div>
            <div>
                <label>Комментарий:</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    maxLength="500" 
                />
            </div>
            <div>
                <h3>Товары в заказе:</h3>
                {formData.orderItems.map((item, index) => (
                    <div key={index}>
                        <span>{item.productName}</span>
                        <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            min="1"
                            required
                        />
                        <span>Цена: {item.unitPrice}</span>
                        <button type="button" onClick={() => handleRemoveItem(index)}>Удалить</button>
                    </div>
                ))}
            </div>
            <button type="submit">Сохранить</button>
        </form>
    );
};

export default OrderForm;
