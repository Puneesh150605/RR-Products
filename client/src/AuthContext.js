import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user'); // Basic user info
      
      // Legacy/Local Admin Support
      const localAdmin = localStorage.getItem('rr_admin');

      if (token && savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
      } else if (localAdmin) {
          setUser({ name: 'Manager', email: 'admin@local', isAdmin: true, _id: 'admin' });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const loginLocalAdmin = () => {
      localStorage.setItem('rr_admin', '1');
      setUser({ name: 'Manager', email: 'admin@local', isAdmin: true, _id: 'admin' });
      return true;
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, name, isAdmin } = res.data;
      
      const userData = { email, name, isAdmin };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Legacy support for admin check
      if (isAdmin) {
        localStorage.setItem('rr_admin', '1');
      }

      setUser(userData);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Login failed'
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      await axios.post('/api/auth/register', { name, email, password });
      return { success: true };
    } catch (err) {
        return { 
            success: false, 
            error: err.response?.data?.error || 'Signup failed' 
        };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rr_admin');
    setUser(null);
    // Redirect to home or login might be handled by component
    window.location.href = '/'; 
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    loginLocalAdmin,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
