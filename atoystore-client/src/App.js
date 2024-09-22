import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import AdminProductList from './components/AdminProductList';
import AdminOrders from './components/AdminOrders';  
import Checkout from './components/Checkout'; 
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile';
import Header from './components/Header'; 
import { CartProvider } from './contexts/CartContext'; 
import { AuthProvider } from './contexts/AuthContext';

function App() {
    return (
        <CartProvider>
            <AuthProvider> 
            <Router>
                <Header /> 
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/admin" element={<ProtectedRoute element={AdminProductList} isAdminRequired />} />
                    <Route path="/admin/orders" element={<ProtectedRoute element={AdminOrders} isAdminRequired />} />
                    <Route path="/checkout" element={<Checkout />} /> 
                    <Route path="/profile" element={<UserProfile />} /> 
                </Routes>
            </Router>
            </AuthProvider>
        </CartProvider>
    );
}

export default App;
