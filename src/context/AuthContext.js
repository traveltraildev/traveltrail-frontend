import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../endpoints';
import { getUserAuthHeader } from '../utils';

// Returns true if the stored token is missing, malformed, or expired.
const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

// Fetch user data based on the stored token.
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('userToken');
      return null;
    }

    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      headers: { ...getUserAuthHeader() },
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  const logout = useCallback(() => {
    localStorage.removeItem('userToken');
    setAuthState({ isAuthenticated: false, loading: false, user: null });
  }, []);

  // Check for a valid token and fetch user data on initial load.
  useEffect(() => {
    const checkUserAuth = async () => {
      setAuthState((prev) => ({ ...prev, loading: true }));
      const user = await fetchUserData();
      setAuthState({
        isAuthenticated: Boolean(user),
        loading: false,
        user: user ? { ...user, role: 'user' } : null,
      });
    };
    checkUserAuth();
  }, []);

  // Auto-logout when the token expires mid-session.
  useEffect(() => {
    if (!authState.isAuthenticated) return undefined;
    const token = localStorage.getItem('userToken');
    if (!token) return undefined;

    let timeoutId;
    try {
      const { exp } = jwtDecode(token);
      if (exp) {
        const msUntilExpiry = exp * 1000 - Date.now();
        if (msUntilExpiry <= 0) {
          logout();
        } else {
          timeoutId = setTimeout(logout, msUntilExpiry);
        }
      }
    } catch {
      logout();
    }
    return () => clearTimeout(timeoutId);
  }, [authState.isAuthenticated, logout]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('userToken', data.token);

      const user = await fetchUserData();
      if (user) {
        setAuthState({ isAuthenticated: true, loading: false, user: { ...user, role: 'user' } });
        return true;
      }
      // Token accepted but profile fetch failed — treat as failed login.
      localStorage.removeItem('userToken');
      setAuthState({ isAuthenticated: false, loading: false, user: null });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        loading: authState.loading,
        user: authState.user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
