import axios from 'axios';

const API_URL = 'http://localhost:5253/api/Products';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

const requestLogger = async (method, url, data = null) => {
    const token = getToken();

    console.log(`Token: ${token}`); 
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
        throw error; 
    }
};

export const getProducts = async () => {
    return requestLogger('GET', '/');
};

export const getProductById = async (id) => {
    return requestLogger('GET', `/${id}`);
};

export const createProduct = async (product) => {
    return requestLogger('POST', '/', product);
};

export const updateProduct = async (id, product) => {
    return requestLogger('PUT', `/${id}`, product);
};

export const deleteProduct = async (id) => {
    return requestLogger('DELETE', `/${id}`);
};
