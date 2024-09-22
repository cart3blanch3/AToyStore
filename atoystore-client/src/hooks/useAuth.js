import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('Decoded Token:', decodedToken);

                const tokenLifetime = 3 * 60 * 60 * 1000; 
                const tokenIssueTime = decodedToken.iat * 1000; 
                const currentTime = Date.now();

                const isTokenExpired = currentTime - tokenIssueTime > tokenLifetime;

                if (!isTokenExpired) {
                    setIsAuthenticated(true);
                    
                    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    console.log('User Role:', role);

                    setIsAdmin(role === 'Admin');

                    const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                    console.log('User ID:', userId);

                    setUserId(userId);
                } else {
                    console.log('Token expired');
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error decoding token', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return { isAuthenticated, isAdmin, userId };
};
