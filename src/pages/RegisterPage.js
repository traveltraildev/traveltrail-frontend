// src/pages/RegisterPage.js
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { registerUser } from '../api/userAPI';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      errors.password = 'Password must include at least one letter and one number';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
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
    setSuccess(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await registerUser(formData);

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login…');
        setFormData({ name: '', email: '', username: '', password: '', confirmPassword: '' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ pt: 14, pb: 8 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          p: 4,
          borderRadius: '12px',
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Create Account
        </Typography>
        {success && (
          <Alert severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange('name')}
            error={Boolean(fieldErrors.name)}
            helperText={fieldErrors.name}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange('username')}
            error={Boolean(fieldErrors.username)}
            helperText={fieldErrors.username}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange('password')}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password || 'At least 8 characters with a letter and a number'}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={Boolean(fieldErrors.confirmPassword)}
            helperText={fieldErrors.confirmPassword}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ width: '100%', py: 1.5, borderRadius: '8px' }}
          >
            {submitting ? 'Creating account…' : 'Register'}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <MuiLink component={RouterLink} to="/login" sx={{ color: 'primary.main', fontWeight: 500 }}>
                Login
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
