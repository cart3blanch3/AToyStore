import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: null,
        productId: null 
    });
    const [fileError, setFileError] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                image: null,
                productId: product.id 
            });
        } else {
            resetForm();
        }
    }, [product]);

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            image: null,
            productId: null
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFormData({ ...formData, image: file });
            setFileError('');
        } else {
            setFileError('Please select a valid image file (e.g., .jpg, .png, .gif).');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Product ID at submit:", formData.productId); 
        if (!fileError && formData.name && formData.price && formData.description) {
            const formPayload = new FormData();
            formPayload.append('name', formData.name);
            formPayload.append('price', formData.price);
            formPayload.append('description', formData.description);
            if (formData.image) formPayload.append('image', formData.image);
    
            onSave(formPayload, formData.productId); 
        } else {
            console.error("Submission error: Missing fields or file error", fileError);
        }
    };    

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div>
                <label>Название</label>
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    maxLength="30" 
                    required 
                />
            </div>
            <div>
                <label>Цена</label>
                <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    maxLength="10" 
                    required 
                />
            </div>
            <div>
                <label>Описание</label>
                <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    maxLength="500" 
                    required 
                />
            </div>
            <div>
                <label>Изображение</label>
                <input type="file" onChange={handleImageChange} accept="image/*" />
                {fileError && <div className="error-message">{fileError}</div>}
            </div>
            <button type="submit" className="save-button">Сохранить</button>
        </form>
    );
};

export default ProductForm;
