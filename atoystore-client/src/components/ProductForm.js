// src/components/ProductForm.js
import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setImageUrl(product.imageUrl);
        } else {
            setName('');
            setPrice('');
            setDescription('');
            setImageUrl('');
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            id: product ? product.id : null,
            name,
            price,
            description,
            imageUrl
        };
        onSave(newProduct);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div>
                <label>Название</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Цена</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Описание</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Ссылка на изображение</label>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="save-button">
                Сохранить
            </button>
        </form>
    );
};

export default ProductForm;
