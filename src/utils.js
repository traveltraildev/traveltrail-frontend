// src/utils/utils.js
import { BASE_URL } from "./endpoints";

export const getAdminAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  console.log('Token in getAuthHeader:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// / Basic implementation of getAuthHeader - retrieves user token from localStorage
export const getUserAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  return {};
};

export { BASE_URL };


