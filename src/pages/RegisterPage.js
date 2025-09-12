import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page is obsolete and now redirects to the Clerk-powered sign-up page.
const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/sign-up', { replace: true });
  }, [navigate]);

  return null; // Render nothing as the redirect is happening
};

export default RegisterPage;