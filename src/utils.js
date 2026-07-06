// src/utils.js
import { BASE_URL } from "./endpoints";

export const getAdminAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUserAuthHeader = () => {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { BASE_URL };
