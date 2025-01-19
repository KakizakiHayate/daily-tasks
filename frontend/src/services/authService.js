import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
const SANCTUM_URL = process.env.REACT_APP_SANCTUM_URL || 'http://localhost:8001';

// デフォルトの設定
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const authService = {
    getCsrfToken: async () => {
        try {
            await axios.get(`${SANCTUM_URL}/sanctum/csrf-cookie`, {
                withCredentials: true
            });
        } catch (error) {
            console.error('CSRF token error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            await authService.getCsrfToken();
            const response = await axios.post(`${API_URL}/api/register`, userData);
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            await authService.getCsrfToken();
            const response = await axios.post(`${API_URL}/api/login`, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                throw new Error('メールアドレスまたはパスワードが正しくありません。');
            }
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/api/logout`);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // セッション状態を確認するメソッド
    checkAuth: async () => {
        try {
            await authService.getCsrfToken(); // CSRFトークンを取得
            const response = await axios.get(`${API_URL}/api/user`, {
                // 認証チェック時は401エラーを通常のレスポンスとして扱う
                validateStatus: function (status) {
                    return status >= 200 && status < 300 || status === 401;
                }
            });
            return response.data;
        } catch (error) {
            console.error('Auth check error:', error);
            return null;
        }
    },

    deleteAccount: async () => {
        try {
            await axios.delete(`${API_URL}/api/account`);
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
                // 認証チェック以外の401/419エラーの場合のみリダイレクト
                if ((error.response?.status === 401 || error.response?.status === 419) && 
                    !error.config.url.endsWith('/api/user')) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
};

export default authService; 