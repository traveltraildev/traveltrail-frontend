import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  const isAdmin = user?.publicMetadata?.role === 'admin';
  const loading = !isLoaded;

  const adminLogin = async () => {
    // Redirect to Clerk sign-in; admin roles are managed in Clerk dashboard
    window.location.href = '/sign-in';
  };

  const adminLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated: isSignedIn && isAdmin,
        adminLoading: loading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
