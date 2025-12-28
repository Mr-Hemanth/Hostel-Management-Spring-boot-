import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists and is valid on initial load
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // In a real app, you might want to validate the token with an API call
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ 
                    email, 
                    role: data.role,
                    userId: data.userId,
                    studentId: data.studentId
                }));
                setToken(data.token);
                setUser({ 
                    email, 
                    role: data.role,
                    userId: data.userId,
                    studentId: data.studentId
                });
                // Return success with role info, let the component handle navigation
                return { success: true, message: data.message, role: data.role };
            } else {
                return { success: false, message: response.data.message || 'Login failed' };
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.error || 'Login failed';
                return { success: false, message: typeof errorMessage === 'object' ? 'Login failed' : errorMessage };
            } else {
                return { success: false, message: 'Network error' };
            }
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ 
                    email, 
                    role: data.role,
                    userId: data.userId,
                    studentId: data.studentId
                }));
                setToken(data.token);
                setUser({ 
                    email, 
                    role: data.role,
                    userId: data.userId,
                    studentId: data.studentId
                });
                return { success: true, message: data.message, role: data.role };
            } else {
                return { success: false, message: response.data.message || 'Registration failed' };
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.error || 'Registration failed';
                return { success: false, message: typeof errorMessage === 'object' ? 'Registration failed' : errorMessage };
            } else {
                return { success: false, message: 'Network error' };
            }
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        // Return a promise to allow the calling component to handle navigation
        return Promise.resolve();
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};