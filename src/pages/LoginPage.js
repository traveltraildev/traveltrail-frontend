import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login via useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const success = await login(formData.username, formData.password, false);
      if (success) {
        navigate('/profile');
      } else {
        setError('Invalid credentials or login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          backgroundColor: 'var(--neutral-50)',
          p: 4,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--primary-500)' }}>
          User Login
        </Typography>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: 'var(--primary-500)',
            '&:hover': { bgcolor: 'var(--primary-600)' },
            py: 1.5,
          }}
        >
          Login
        </Button>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Need to Join Trishelta?{' '}
          <Link href="/register" sx={{ color: 'var(--primary-500)' }}>
            Sign Up
          </Link>
        </Typography>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Need to login as an admin?{' '}
          <Link href="/admin/login" sx={{ color: 'var(--primary-500)' }}>
            Admin Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;