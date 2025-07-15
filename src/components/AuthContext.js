import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null);

  useEffect(() => {
    if (token) {
      // Optionally, decode token to get user info or fetch profile
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await apiService.request('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (response.token) {
        setToken(response.token);
        setUser(response.admin);
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user', JSON.stringify(response.admin));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 