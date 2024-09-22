import axios from 'axios';

const API_URL = 'http://localhost:5253/api/Orders';

// Получение токена из localStorage
const getToken = () => localStorage.getItem('token');

// Создаем экземпляр axios с базовой конфигурацией
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }
});

// Функция для обработки запросов с логированием
const requestLogger = async (method, url, data = null) => {
    const token = getToken();

    console.log(`Token: ${token}`); // Логирование токена
    console.log(`Request: ${method} ${url}`, data ? `Data: ${JSON.stringify(data)}` : '');

    try {
        const response = await axiosInstance.request({
            method,
            url,
            data
        });

        console.log(`Response: ${method} ${url}`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error: ${method} ${url}`, error.response?.data || error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

export const getOrderById = async (id) => {
    return requestLogger('GET', `/${id}`);
};

export const getAllOrders = async () => {
    return requestLogger('GET', '/');
};

export const getOrdersByUserId = async (userId) => {
    return requestLogger('GET', `/user/${userId}`);
};

export const createOrder = async (order) => {
    return requestLogger('POST', '/', order);
};

export const updateOrder = async (id, order) => {
    return requestLogger('PUT', `/${id}`, order);
};

export const deleteOrder = async (id) => {
    return requestLogger('DELETE', `/${id}`);
};
