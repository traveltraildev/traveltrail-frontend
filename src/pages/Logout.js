// src/pages/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const Logout = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await signOut();
      } catch (e) {
        console.error('Clerk signOut error:', e);
      }
  // legacy adminToken cleared on server-side; no client-side admin token to clear
      navigate('/');
    })();
  }, []);

  return null;
};

export default Logout;