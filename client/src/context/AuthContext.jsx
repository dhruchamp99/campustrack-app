import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => {
                    console.error('Auth Error', err);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password, role) => {
        const loginData = {
            password,
            role
        };

        // For students, send enrollmentNumber; for admin/teacher, send email
        if (role === 'student') {
            loginData.enrollmentNumber = email;
        } else {
            loginData.email = email;
        }

        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
        }
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
