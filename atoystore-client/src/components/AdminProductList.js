import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import Modal from './Modal'; 
import ProductForm from './ProductForm';
import './AdminProductList.css'; 

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };  

        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsEditMode(false);
        setIsModalOpen(true); 
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditMode(true);
        setIsModalOpen(true); 
    };

    const handleDeleteProduct = async (productId) => {
        const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот товар?');
        if (isConfirmed) {
            await deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId)); 
        }
    };

    const handleSaveProduct = async (product) => {
        if (isEditMode) {
            await updateProduct(product.id, product);
        } else {
            const newProduct = await createProduct(product);
            setProducts([...products, newProduct]); 
        }
        setIsModalOpen(false); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); 
    };

    return (
        <div className="admin-product-list-container">
            <div className="admin-header">
                <button onClick={handleAddProduct} className="admin-add-product-button">
                    Добавить товар
                </button>
                <h1 className="admin-product-list-title">Управление товарами</h1>
            </div>
            <div className="admin-product-grid">
                {products.map(product => (
                    <div key={product.id} className="admin-product-card">
                        <img src={`http://localhost:5253${product.imageUrl}`} alt={product.name} className="admin-product-image" />
                        <div className="admin-product-details">
                            <h2>{product.name}</h2>
                            <p className="admin-product-price">{product.price} ₸</p>
                            <div className="admin-button-container">
                                <button onClick={() => handleEditProduct(product)} className="admin-edit-button">
                                    Редактировать
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="admin-delete-button">
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ProductForm product={selectedProduct} onSave={handleSaveProduct} />
            </Modal>
        </div>
    );
};

export default AdminProductList;
