import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const validate = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        const from = location.state?.from?.pathname || '/profile';
        navigate(from, { replace: true });
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ pt: 14, pb: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          backgroundColor: 'background.paper',
          p: 4,
          borderRadius: '12px',
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          User Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          label="Username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange('username')}
          error={Boolean(fieldErrors.username)}
          helperText={fieldErrors.username}
          required
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange('password')}
          error={Boolean(fieldErrors.password)}
          helperText={fieldErrors.password}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ py: 1.5 }}
        >
          {submitting ? 'Logging in…' : 'Login'}
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          New here?{' '}
          <MuiLink component={RouterLink} to="/register" sx={{ color: 'primary.main', fontWeight: 500 }}>
            Sign Up
          </MuiLink>
        </Typography>

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Need to login as an admin?{' '}
          <MuiLink component={RouterLink} to="/admin/login" sx={{ color: 'primary.main', fontWeight: 500 }}>
            Admin Login
          </MuiLink>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
