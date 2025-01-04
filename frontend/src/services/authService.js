import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
axios.defaults.withCredentials = true;

const authService = {
    register: async (userData) => {
        await axios.get(`${API_URL}/sanctum/csrf-cookie`);
        const response = await axios.post(`${API_URL}/api/register`, userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (email, password) => {
        await axios.get(`${API_URL}/sanctum/csrf-cookie`);
        const response = await axios.post(`${API_URL}/api/login`, {
            email,
            password
        });
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/api/logout`);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Axiosのインターセプターを設定
    setupAxiosInterceptors: () => {
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
};

export default authService; 