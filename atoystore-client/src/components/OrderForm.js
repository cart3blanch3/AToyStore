import React, { useState, useEffect } from 'react';
import { createOrder, updateOrder } from '../services/orderService'; // Import functions from your controller

const OrderForm = ({ order, onSave, token }) => {
    const [formData, setFormData] = useState({
        id: '',
        customerName: '',
        customerPhone: '',
        address: '',
        comment: '',
        orderItems: []
    });

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
        const { value } = e.target;
        const updatedItems = [...formData.orderItems];
        updatedItems[index] = {
            ...updatedItems[index],
            quantity: value // Only allow quantity change
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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // Update order
                await updateOrder(formData.id, formData, token);
            } else {
                // Create new order
                await createOrder(formData, token);
            }
            onSave(); // Call onSave to refresh the order list
        } catch (error) {
            console.error(error);
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
                    required
                />
            </div>
            <div>
                <label>Телефон клиента:</label>
                <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Адрес:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Комментарий:</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
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
                        <span>Цена: {item.unitPrice}</span> {/* Display price without editing */}
                        <button type="button" onClick={() => handleRemoveItem(index)}>Удалить</button>
                    </div>
                ))}
            </div>
            <button type="submit">Сохранить</button>
        </form>
    );
};

export default OrderForm;
