// src/utils/utils.js
import { BASE_URL } from "./endpoints";

export const getAuthHeader = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { BASE_URL };