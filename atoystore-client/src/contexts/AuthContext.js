import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                setIsAuthenticated(true);
                setIsAdmin(role === 'Admin');
                setUserId(decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
            } catch (error) {
                console.error('Error decoding token', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId, setIsAuthenticated, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
