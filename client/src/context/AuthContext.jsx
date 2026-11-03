import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('qm_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check auth status on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('qm_token');
      if (token) {
        try {
          const data = await authService.getMe();
          if (data?.user) {
            setUser(data.user);
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          setUser(null);
          localStorage.removeItem('qm_token');
          localStorage.removeItem('qm_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('qm_user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
