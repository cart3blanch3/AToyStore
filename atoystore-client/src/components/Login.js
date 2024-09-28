import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import Modal from './Modal';
import Register from './Register';
import './Login.css';
import { useAuthContext } from '../contexts/AuthContext';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const navigate = useNavigate();
    const { setIsAuthenticated, setIsAdmin } = useAuthContext();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setErrorMessage('Email и пароль не должны быть пустыми.');
            return; 
        }

        try {
            const token = await loginUser({ email, password });
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            setIsAuthenticated(true);
            setIsAdmin(role === 'Admin');

            if (role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

            if (onLoginSuccess) onLoginSuccess();
            setErrorMessage(''); 
        } catch (error) {
            console.error('Login error', error);
            setErrorMessage('Ошибка входа. Проверьте свои учетные данные.');
        }
    };

    const openRegisterModal = () => {
        setIsLoginVisible(false);
        setIsRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
        setIsLoginVisible(true);
    };

    return (
        <div className="login-container">
            {isLoginVisible && (
                <>
                    <h2>Вход</h2>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Имя пользователя"
                        className="login-input"
                        maxLength="50"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        className="login-input"
                        maxLength="50"
                        required
                    />
                    <button onClick={handleLogin} className="login-button">Войти</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <p className="register-prompt">Нет аккаунта?</p>
                    <button onClick={openRegisterModal} className="register-button">
                        Регистрация
                    </button>
                </>
            )}

            <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal}>
                <Register />
            </Modal>
        </div>
    );
};

export default Login;
