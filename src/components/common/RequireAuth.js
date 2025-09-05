import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const RequireAuth = ({ children, isAdmin = false }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const loading = !isLoaded; 
  const location = useLocation();

  const overallLoading = loading; // only Clerk loading is required now

  useEffect(() => {
    console.log('RequireAuth - loading:', loading, 'isSignedIn:', isSignedIn, 'user:', user, 'isAdmin prop:', isAdmin);
  }, [loading, isSignedIn, user, isAdmin]);

  if (loading) {
    return <CircularProgress />;
  }
  if (overallLoading) {
    return <CircularProgress />;
  }
  
  if (isAdmin) {
    const isClerkAdmin = user?.publicMetadata?.role === 'admin';
    if (!isClerkAdmin) {
      console.log('RequireAuth - Admin access required, but user is not Clerk-admin. Redirecting to /login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    if (!isSignedIn) {
      console.log('RequireAuth - Not authenticated as user, redirecting to /login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  console.log('RequireAuth - Authenticated and authorized. Rendering children.');
  return <Outlet />;
};

export default RequireAuth;