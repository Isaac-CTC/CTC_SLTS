import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState(localStorage.getItem('token') || null); 

  const API_BASE_URL = 'http://localhost:2007';

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const register = async (fullName, username, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        fullName,
        username,
        email,
        password,
      });

      toast.success('Registration successful! Please log in.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: emailOrUsername,
        email: emailOrUsername,
        password,
      });

      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);

      const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      
      setUser(userResponse.data.user);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,                      
    loading,                    
    token,                      
    register,                  
    login,                     
    logout,                    
    isAuthenticated: !!token,   
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
