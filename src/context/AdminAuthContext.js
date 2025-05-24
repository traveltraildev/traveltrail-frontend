import React, { createContext, useContext, useState, useEffect } from "react";
import { adminLoginPath, BASE_URL } from "../endpoints";

const checkAdminAuth = async (setAdminAuthState) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    setAdminAuthState({ isAdminAuthenticated: false, adminLoading: false });
    return;
  }

  try {
    const response = await fetch("/api/admin/check-auth", {
      // Adjust endpoint as needed
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setAdminAuthState({
      isAdminAuthenticated: response.ok,
      adminLoading: false,
    });

    if (!response.ok) {
      localStorage.removeItem("adminToken");
    }
  } catch (error) {
    console.error("Admin auth check failed:", error);
    localStorage.removeItem("adminToken");
    setAdminAuthState({ isAdminAuthenticated: false, adminLoading: false });
  }
};

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminAuthState, setAdminAuthState] = useState({
    isAdminAuthenticated: false,
    adminLoading: true,
  });

  useEffect(() => {
    checkAdminAuth(setAdminAuthState);
  }, []);

  const adminLogin = async (username, password) => {
    try {
      const response = await fetch(adminLoginPath, {
        // Adjust endpoint as needed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.adminToken);
        setAdminAuthState({ isAdminAuthenticated: true, adminLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminAuthState({ isAdminAuthenticated: false, adminLoading: false });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated: adminAuthState.isAdminAuthenticated,
        adminLoading: adminAuthState.adminLoading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
