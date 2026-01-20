import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token or just set state (Assuming valid for simplicity initially, or verify)
            // Ideally: fetch profile
            fetchProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async (token) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            // Assuming proxy is set up or hardcode localhost
            const res = await axios.get('http://localhost:5000/api/auth/profile', config);
            setUser({ ...res.data, token }); // Keep token in user obj if needed, or just LS
            setLoading(false);
        } catch (error) {
            console.error("Auth Error", error);
            localStorage.removeItem('token');
            setLoading(false);
        }
    };

    const login = async (email, password, role) => { // Role might be inferred or passed
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: role !== 'student' ? email : undefined,
            enrollmentNumber: role === 'student' ? email : undefined, // Reuse email field arg as ID for student
            password,
            role
        });
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', userData);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
