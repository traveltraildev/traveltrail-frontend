// src/api/userAPI.js
import { BASE_URL } from '../endpoints';

export const getUserProfile = async (getToken) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data, getToken) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return await response.json();
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

export const changeUserPassword = async (userId, data, getToken) => {
  try {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/api/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to change password');
    return await response.json();
  } catch (error) {
    console.error('Error in changeUserPassword:', error);
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};