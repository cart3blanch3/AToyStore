import axios from 'axios';

const API_URL = 'http://localhost:5253/api/auth';  // Адрес вашего API

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error during registration", error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data.token;  
    } catch (error) {
        console.error("Error during login", error);
        throw error;
    }
};
