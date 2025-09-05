import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Paper,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Use Clerk sign-in page instead of the old local login form

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to Clerk sign-in route
    navigate('/sign-in');
  }, [navigate]);

  // Login is handled by Clerk; this page redirects to Clerk's sign-in flow.

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Stack spacing={3} alignItems="center">
          <Box component={RouterLink} to="/">
            <img src="/images/mainLogo.svg" alt="Trishelta Logo" style={{ height: 60 }} />
          </Box>
          <Typography component="h1" variant="h5" fontWeight="600">
            Redirecting to sign-in...
          </Typography>

          <Stack spacing={1} sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" variant="body2">
                Sign Up
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link component={RouterLink} to="/admin/login" variant="body2">
                Admin Login
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
