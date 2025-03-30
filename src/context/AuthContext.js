import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Combine state into a single object
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setAuthState({ isAuthenticated: false, loading: false });
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/check-auth', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setAuthState({
          isAuthenticated: response.ok,
          loading: false
        });

        if (!response.ok) {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('adminToken');
        setAuthState({ isAuthenticated: false, loading: false });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.adminToken); // Match server response key
        setAuthState({ isAuthenticated: true, loading: false });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAuthState({ isAuthenticated: false, loading: false });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authState.isAuthenticated,
      loading: authState.loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);