import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element: Component, isAdminRequired }) => {
    const token = localStorage.getItem('token');

    let isAuthenticated = false;
    let isAdmin = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; 

            if (decodedToken.exp > currentTime) {
                isAuthenticated = true;
                isAdmin = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'Admin';
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error decoding token', error);
            localStorage.removeItem('token');
        }
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (isAdminRequired && !isAdmin) {
        return <Navigate to="/" />;
    }

    return <Component />;
};

export default ProtectedRoute;
