import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.access_token) {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });
        }
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Axiosのインターセプターを設定
    setupAxiosInterceptors: () => {
        axios.interceptors.request.use(
            (config) => {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user?.access_token) {
                    config.headers.Authorization = `Bearer ${user.access_token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
};

export default authService; 