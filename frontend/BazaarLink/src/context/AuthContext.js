import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, removeToken } from '../services/tokenUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const userData = getUser();
      
      if (token && userData) {
        setUserState(userData);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
  };

  const logout = () => {
    removeToken();
    setUserState(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};