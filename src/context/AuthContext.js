import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { adminCheckout } from '../endpoints';
import { BASE_URL } from '../endpoints';
import { getAuthHeader } from '../utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return null;

      const response = await fetch(`${BASE_URL}/api/users/profile`, {
        headers: {
          ...getAuthHeader(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      throw new Error('Failed to fetch user data');
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          const response = await fetch(adminCheckout, {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            setAuthState({
              isAuthenticated: true,
              loading: false,
              user: { role: 'admin' },
            });
          } else {
            localStorage.removeItem('adminToken');
            checkUserAuth();
          }
        } catch (error) {
          console.error('Admin auth check failed:', error);
          localStorage.removeItem('adminToken');
          checkUserAuth();
        }
      } else {
        checkUserAuth();
      }
    };

    const checkUserAuth = async () => {
      const userToken = localStorage.getItem('userToken');
      if (userToken) {
        const user = await fetchUserData();
        if (user) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: { ...user, role: 'user' },
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            loading: false,
            user: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password, isAdmin = false) => {
    try {
      let response;
      if (isAdmin) {
        response = await fetch(adminCheckout, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
      } else {
        response = await fetch(`${BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
      }

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const tokenKey = isAdmin ? 'adminToken' : 'userToken';
      localStorage.setItem(tokenKey, data.token);

      if (!isAdmin) {
        const user = await fetchUserData();
        if (user) {
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: { ...user, role: 'user' },
          });
        } else {
          localStorage.removeItem(tokenKey);
          throw new Error('Failed to fetch user data after login');
        }
      } else {
        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: { role: 'admin' },
        });
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    setAuthState({ isAuthenticated: false, loading: false, user: null });
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