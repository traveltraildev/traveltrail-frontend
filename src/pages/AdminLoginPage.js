// src/pages/AdminLoginPage.js
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../endpoints';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.removeItem("adminToken");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const success = await login(username, password, isAdmin);
      if (success) {
        navigate(isAdmin ? '/admin/dashboard' : '/profile');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body2" onClick={() => setIsAdmin(true)}>
          Admin Login
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body2" onClick={() => setIsAdmin(false)}>
          User Login
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {error && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: 'var(--primary-500)',
            '&:hover': { bgcolor: 'var(--primary-600)' },
          }}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default AdminLoginPage;