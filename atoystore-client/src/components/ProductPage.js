import React, { useEffect, useState } from 'react';
import { getProductById } from '../services/productService';
import './ProductPage.css';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const ProductPage = ({ productId, onClose }) => {
    const [product, setProduct] = useState(null);
    const { handleAddToCart } = useContext(CartContext); 

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(productId);
            setProduct(data);
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <p>Загрузка...</p>;
    }

    const handleAddToCartClick = () => {
        handleAddToCart({ ...product, quantity: 1 }); 
    };

    return (
        <div className="product-page">
            <button className="product-page-close-button" onClick={onClose}>
                &times;
            </button>
            <img 
                src={`http://localhost:5253${product.imageUrl}`} 
                alt={product.name} 
                className="product-page-image" 
            />
            <div className="product-page-details">
                <h1>{product.name}</h1>
                <p className="product-page-price">{product.price} ₸</p>
                <p className="product-page-description">{product.description}</p>
                <button 
                    className="add-to-cart-button" 
                    onClick={handleAddToCartClick}
                >
                    Добавить в корзину
                </button>
            </div>
        </div>
    );
};

export default ProductPage;
