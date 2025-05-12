import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const RequireAuth = ({ children, isAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated, user);
  }, [isAuthenticated, user]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin && user?.role !== 'admin') {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;