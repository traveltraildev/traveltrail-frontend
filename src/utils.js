// src/utils/utils.js
import { BASE_URL } from "./endpoints";

export const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  console.log('Token in getAuthHeader:', token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { BASE_URL };