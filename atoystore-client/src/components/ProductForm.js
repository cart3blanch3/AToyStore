import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
        } else {
            resetForm();
        }
    }, [product]);

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        if (image) formData.append('image', image);

        console.log('Form data to be submitted:', { name, price, description });
        onSave(formData, product ? product.id : null);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div>
                <label>Название</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Цена</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
                <label>Описание</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Изображение</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
            </div>
            <button type="submit" className="save-button">Сохранить</button>
        </form>
    );
};

export default ProductForm;
