import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Axiosインターセプターを設定
        authService.setupAxiosInterceptors();
        
        // ログインページとレジスターページでは認証チェックをスキップ
        if (location.pathname === '/login' || location.pathname === '/register') {
          setIsLoading(false);
          return;
        }

        // セッション状態を確認
        const userData = await authService.checkAuth();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          navigate('/login');
        }
      } catch (error) {
        console.error('認証状態の確認に失敗しました:', error);
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [location.pathname]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      if (response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        navigate('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      error 
    }}>
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