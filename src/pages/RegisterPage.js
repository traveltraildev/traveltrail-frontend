// src/pages/RegisterPage.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Alert, Link as MuiLink, CssBaseline } from '@mui/material';
import { registerUser } from '../api/userAPI';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSuccess(null);
      return;
    }

    try {
      const response = await registerUser(formData);
      
      if (response.success) {
        setSuccess('Registration successful! Please log in.');
        setError(null);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
        setSuccess(null);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      setSuccess(null);
      console.error('Registration error:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: 'var(--neutral-50)',
          p: 4,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--primary-500)' }}>
          Create Account
        </Typography>
        {success && (
          <Alert severity="success" sx={{ width: '100%', my: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ width: '100%', my: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            variant="outlined"
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'var(--primary-500)',
              '&:hover': { bgcolor: 'var(--primary-600)' },
              width: '100%',
              py: 1.5,
              borderRadius: '8px'
            }}
          >
            Register
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{ color: 'var(--primary-500)', fontWeight: 500 }}
              >
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