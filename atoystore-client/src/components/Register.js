import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import InputMask from 'react-input-mask'; 
import './Register.css'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');  
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError('Введите корректный номер телефона в формате +7 (7XX) XXX-XX-XX'); 
            return;
        } else {
            setPhoneError(''); 
        }
        if (!validateEmail(email)) {
            setEmailError('Введите корректный email.');
            return;
        } else {
            setEmailError('');
        }
        try {
            await registerUser({ email, password, fullName, phoneNumber });
            alert('Registration successful');
            clearForm();
        } catch (error) {
            setErrorMessage('Регистрация не удалась. Попробуйте снова.');
        }
    };

    const validatePhoneNumber = (number) => {
        const phonePattern = /^\+7 \(7\d{2}\) \d{3}-\d{2}-\d{2}$/;
        return phonePattern.test(number);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
        setPhoneNumber('');
        setEmailError('');
        setPhoneError('');
        setErrorMessage('');
    };

    return (
        <form className="register-form" onSubmit={handleRegister}>
            <h2>Регистрация</h2>
            <input
                type="text"
                placeholder="Полное имя"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="register-input"
                maxLength="50" 
            />
            <InputMask
                mask="+7 (999) 999-99-99"
                placeholder="+7 (7XX) XXX-XX-XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="register-input"
                required
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value) ? setEmailError('') : setEmailError('Введите корректный email.');
                }}
                className="register-input"
                maxLength="50" 
                required
            />
            {emailError && <div className="error-message">{emailError}</div>}
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
                maxLength="50" 
                required
            />
            <button type="submit" className="register-button2">Зарегистрироваться</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
    );
};

export default Register;
