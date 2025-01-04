import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

// デフォルトの設定
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Accept'] = 'application/json';

const authService = {
    register: async (userData) => {
        try {
            await axios.get(`${API_URL}/sanctum/csrf-cookie`);
            const response = await axios.post(`${API_URL}/api/register`, userData);
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            await axios.get(`${API_URL}/sanctum/csrf-cookie`);
            const response = await axios.post(`${API_URL}/api/login`, {
                email,
                password
            });
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/api/logout`);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('user');
            throw error;
        }
    },

    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            return null;
        }
    },

    deleteAccount: async () => {
        try {
            await axios.delete(`${API_URL}/api/account`);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Account deletion error:', error);
            throw error;
        }
    },

    // Axiosのインターセプターを設定
    setupAxiosInterceptors: () => {
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 || error.response?.status === 419) {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
};

export default authService; 