import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage)
    const storedUser = localStorage.getItem('fintra_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      // Assuming the backend endpoint is /login or /api/login relative to base URL
      // Since no specific path was given, I'll use /login.
      // If the API requires a specific structure, I'd update it.
      // For now, I'll assume standard POST with {username, password}
      const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
      const userData = response.data; // Expected to contain user info and token
      setUser(userData);
      localStorage.setItem('fintra_user', JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/signup`, userData);
      // Usually signup logs you in automatically, or requires login.
      // For this app, I'll assume it returns the user object like login.
      const user = response.data;
      setUser(user);
      localStorage.setItem('fintra_user', JSON.stringify(user));
      return true;
    } catch (err) {
      console.error("Signup failed", err);
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fintra_user');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
