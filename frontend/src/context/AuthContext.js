import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting login...');
      const data = await authService.login(email, password);
      console.log('Login response:', data);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const message = err.message || 'Login failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('Attempting registration...', userData);
      const data = await authService.register(userData);
      console.log('Registration response:', data);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.message || 'Registration failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const googleLogin = async (credential) => {
    try {
      setError(null);
      const data = await authService.googleLogin(credential);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      toast.success('Google Sign-In successful!');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Google Sign-In failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
