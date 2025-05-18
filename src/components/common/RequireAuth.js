import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const RequireAuth = ({ children, isAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const location = useLocation();

  const overallLoading = loading || adminLoading;

  console.log('RequireAuth - User loading:', loading);
  console.log('RequireAuth - Admin loading:', adminLoading);
  console.log('RequireAuth - isAuthenticated:', isAuthenticated);
  console.log('RequireAuth - isAdminAuthenticated:', isAdminAuthenticated);
  console.log('RequireAuth - user:', user);
  console.log('RequireAuth - isAdmin prop:', isAdmin);
  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated, user);
  }, [isAuthenticated, user]);

  if (loading) {
    return <CircularProgress />;
  }
  if (overallLoading) {
    return <CircularProgress />;
  }
  
  if (isAdmin) {
    if (!isAdminAuthenticated) {
      console.log('RequireAuth - Admin access required, but not authenticated as admin. Redirecting to /login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Optional: Additional check if needed, though isAdminAuthenticated should be primary
    // if (user?.role !== 'admin') {
    //   console.log('RequireAuth - Admin access required, but user role is not admin. Redirecting to /profile');
    //   return <Navigate to="/profile" state={{ from: location }} replace />;
    // }
  } else {
    if (!isAuthenticated) {
      console.log('RequireAuth - Not authenticated as user, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  }
  console.log('RequireAuth - Authenticated and authorized. Rendering children.');
  return <Outlet />;
};

export default RequireAuth;