import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistAPI';
import { Snackbar, Alert } from '@mui/material';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchWishlist = useCallback(async () => {
    if (isSignedIn) {
      setLoading(true);
      try {
        const token = await getToken();
        const data = await getWishlist(token);
        setWishlist(data || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]); // Clear wishlist on error
      }
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = async (itemId, itemType) => {
    try {
      const token = await getToken();
      // The backend sends back the new wishlist item, but it won't be populated.
      // We can either ask the backend to populate it, or just refetch the wishlist.
      // Refetching is simpler and ensures data consistency.
      await addToWishlist(token, { itemId, itemType });
      await fetchWishlist(); // Refetch to get populated item
      setNotification({ open: true, message: 'Added to wishlist!', severity: 'success' });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setNotification({ open: true, message: error.message || 'Could not add to wishlist.', severity: 'error' });
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = await getToken();
      await removeFromWishlist(token, itemId);
      setWishlist(prev => prev.filter(item => item.item?._id !== itemId));
      setNotification({ open: true, message: 'Removed from wishlist', severity: 'info' });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setNotification({ open: true, message: 'Could not remove from wishlist.', severity: 'error' });
    }
  };

  const isWishlisted = (itemId) => {
    if (!wishlist || wishlist.length === 0) return false;
    return wishlist.some(item => item.item?._id === itemId);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const value = {
    wishlist,
    loading,
    addItem,
    removeItem,
    isWishlisted,
    refetch: fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </WishlistContext.Provider>
  );
};