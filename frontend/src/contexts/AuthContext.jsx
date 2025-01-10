import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 初期化時に認証状態を確認
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    }
    // Axiosインターセプターを設定
    authService.setupAxiosInterceptors();
  }, []);

  // CSRFトークンを取得する関数
  const refreshCsrfToken = async () => {
    try {
      await axios.get('http://backend:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
    } catch (error) {
      console.error('CSRFトークンの更新に失敗しました:', error);
    }
  };

  const login = async () => {
    await refreshCsrfToken(); // ログイン時にCSRFトークンを更新
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 