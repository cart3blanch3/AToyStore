import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService'; // Import login service
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode the token
import Modal from './Modal'; // Import Modal component
import Register from './Register'; // Import Register component
import './Login.css'; // Import custom CSS for styling
import { useAuthContext } from '../contexts/AuthContext'; // Import AuthContext

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State for register modal
    const [isLoginVisible, setIsLoginVisible] = useState(true); // State for login visibility
    const navigate = useNavigate();
    const { setIsAuthenticated, setIsAdmin } = useAuthContext();

    const handleLogin = async () => {
        try {
            const token = await loginUser({ email, password }); // Login logic
            localStorage.setItem('token', token); // Save token to localStorage

            // Decode token to check role
            const decodedToken = jwtDecode(token);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            setIsAuthenticated(true);
            setIsAdmin(role === 'Admin');

            // Redirect based on role
            if (role === 'Admin') {
                navigate('/admin'); // Redirect to admin page
            } else {
                navigate('/'); // Redirect to home page
            }

            if (onLoginSuccess) onLoginSuccess(); // Notify parent component of successful login
        } catch (error) {
            console.error('Login error', error);
        }
    };

    const openRegisterModal = () => {
        setIsLoginVisible(false); // Hide login form
        setIsRegisterModalOpen(true); // Open registration modal
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false); // Close registration modal
        setIsLoginVisible(true); // Show login form again
    };

    return (
        <div className="login-container">
            {isLoginVisible && ( // Conditional rendering of login form
                <>
                    <h2>Вход</h2>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Имя пользователя"
                        className="login-input"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        className="login-input"
                    />
                    <button onClick={handleLogin} className="login-button">Войти</button>

                    <p className="register-prompt">Нет аккаунта?</p>
                    <button 
                        onClick={openRegisterModal} // Open registration modal
                        className="register-button">
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
