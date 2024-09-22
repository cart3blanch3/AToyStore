import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext'; // Import AuthContext
import Modal from './Modal';
import Login from './Login';
import Register from './Register';
import CartDropdown from './CartDropdown';
import './Header.css';
import { CartContext } from '../contexts/CartContext'; // Import CartContext

const Header = () => {
    const { isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin } = useAuthContext(); // Use context
    const navigate = useNavigate();
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const { cartItems } = useContext(CartContext); // Get cart items

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
        navigate('/', { replace: true });
    };

    return (
        <header className="header">
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">ATOY</Link>
                </div>
                <ul className="nav-list">
                    {!isAdmin && (
                        <li className="nav-item">
                            <Link to="/">Главная</Link>
                        </li>
                    )}
                    {!isAdmin && (
                        <li className="nav-item">
                            <CartDropdown itemCount={cartItems.length} />
                        </li>
                    )}
                    {isAuthenticated && !isAdmin && ( // Display profile link only for non-admin users
                        <li className="nav-item">
                            <Link to="/profile">Профиль</Link>
                        </li>
                    )}
                    {isAuthenticated && (
                        <>
                            {isAdmin && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/admin">Админ</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/admin/orders">Заказы</Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <button onClick={handleLogout}>Выйти</button>
                            </li>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <button onClick={() => setLoginOpen(true)}>Вход</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={() => setRegisterOpen(true)}>Регистрация</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <Modal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)}>
                <Login onLoginSuccess={() => setLoginOpen(false)} />
            </Modal>

            <Modal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)}>
                <Register />
            </Modal>
        </header>
    );
};

export default Header;
