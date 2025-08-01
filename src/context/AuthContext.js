import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '../endpoints';

// Basic implementation of getAuthHeader - retrieves user token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  return {};
};
// Function to fetch user data based on token
// Moved outside the component to avoid redefining on each render
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    const response = await fetch(`${BASE_URL}/api/users/profile`, { // Assuming this endpoint exists
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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  // Effect to check for user token and fetch user data on initial load
  useEffect(() => {
    const checkUserAuth = async () => {
      console.log('AuthContext useEffect: Initializing authentication...');
      setAuthState(prevState => ({ ...prevState, loading: true }));
      const userToken = localStorage.getItem('userToken');
 if (userToken) {
 console.log('AuthContext useEffect: User token found.');
 const user = await fetchUserData();
 console.log('AuthContext useEffect: Fetched user data:', user);
 if (user) {
 setAuthState({
 isAuthenticated: true,
 loading: false,
 user: { ...user, role: 'user' },
        });
      } else { // User token exists but fetching user data failed or returned null - invalid token
 console.log('AuthContext useEffect: User token invalid or user data fetch failed.');
 setAuthState({
 isAuthenticated: false,
 loading: false,
 user: null,
        });
      }
    } else {
 console.log('AuthContext useEffect: No user token found. Setting auth state to unauthenticated.');
 setAuthState({
 isAuthenticated: false,
 loading: false,
 user: null,
 });
    }
    };
    checkUserAuth();
  }, []);

  // Function to handle user login
  const login = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, { // Assuming this is the user login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      console.log('Backend login response data:', data);
      localStorage.setItem('userToken', data.token);
      console.log('Token set in localStorage:', data.token ? data.token.substring(0, 10) + '...' : 'None');

      const user = await fetchUserData(); // Fetch user data after successful login
      if (user) {
        setAuthState({ isAuthenticated: true, loading: false, user: { ...user, role: 'user' } });
      } else {
        // If fetching user data fails after login, remove the token and set to unauthenticated
        localStorage.removeItem('userToken');
        console.error('Failed to fetch user data after successful login. Removing token.');
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
        // Consider throwing an error or returning false to indicate a partial failure
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
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