import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const RequireAuth = ({ isAdmin = false }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const location = useLocation();

  if (loading || adminLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          pt: '68px',
        }}
        role="status"
        aria-label="Checking authentication"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAdmin) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
