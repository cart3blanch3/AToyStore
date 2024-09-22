import React, { useEffect, useState, useContext } from 'react';
import { getProducts } from '../services/productService';
import ProductPage from './ProductPage';
import Modal from './Modal';
import { CartContext } from '../contexts/CartContext';  // Импорт контекста корзины
import './ProductList.css';

const API_BASE_URL = 'http://localhost:5253';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);  // Состояние для отслеживания ошибки

    const { handleAddToCart } = useContext(CartContext);  // Используем функцию добавления в корзину из контекста

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setError(null);  // Сброс ошибки, если запрос успешен
            } catch (err) {
                setError('Не удалось загрузить список продуктов. Попробуйте обновить страницу.');
                console.error('Ошибка при загрузке продуктов:', err);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        setSelectedProduct(productId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddToCartClick = (product) => {
        // Добавляем товар в корзину с количеством 1
        handleAddToCart({ ...product, quantity: 1 });
    };

    return (
        <div className="product-list">
            <h1>Каталог</h1>
            {error ? (  // Если есть ошибка, показываем сообщение об ошибке
                <div className="error-message">{error}</div>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
                            <img 
                                src={`${API_BASE_URL}${product.imageUrl}`}
                                alt={product.name} 
                                className="product-image" 
                            />
                            <div className="product-details">
                                <h2>{product.name}</h2>
                                <p className="product-price">{product.price} ₸</p>
                                <button 
                                    className="add-to-cart-button" 
                                    onClick={(e) => { 
                                        e.stopPropagation();  // Останавливаем всплытие события клика
                                        handleAddToCartClick(product);  // Используем функцию добавления в корзину из контекста
                                    }}
                                >
                                    В корзину
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ProductPage productId={selectedProduct} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default ProductList;
