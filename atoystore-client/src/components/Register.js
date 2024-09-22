import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import InputMask from 'react-input-mask'; 
import './Register.css'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validatePhoneNumber(phoneNumber)) {
            alert('Введите корректный номер телефона в формате +7 (7XX) XXX-XX-XX');
            return;
        }
        try {
            await registerUser({ email, password, fullName, phoneNumber });
            alert('Registration successful');
        } catch (error) {
            alert('Registration failed');
        }
    };

    const validatePhoneNumber = (number) => {
        const phonePattern = /^\+7 \(7\d{2}\) \d{3}-\d{2}-\d{2}$/;
        return phonePattern.test(number);
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
            />
            <InputMask
                mask="+7 (999) 999-99-99" // Маска для ввода номера телефона
                placeholder="+7 (7XX) XXX-XX-XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="register-input"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
            />
            <button type="submit" className="register-button2">Зарегистрироваться</button>
        </form>
    );
};

export default Register;
