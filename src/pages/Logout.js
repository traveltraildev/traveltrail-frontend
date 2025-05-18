// src/pages/Logout.js
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    adminLogout();
    navigate('/');
  }, []);

  return null;
};

export default Logout;