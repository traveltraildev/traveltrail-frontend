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

// Admin login is handled by Clerk sign-in and role assignment in Clerk dashboard.

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/sign-in');
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Stack spacing={3} alignItems="center">
          <Box component={RouterLink} to="/">
            <img src="/images/mainLogo.svg" alt="Trishelta Logo" style={{ height: 60 }} />
          </Box>
          <Typography component="h1" variant="h5" fontWeight="600">
            Admin Portal
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Admin Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2">
            <Link component={RouterLink} to="/login" variant="body2">
              Switch to User Login
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AdminLoginPage;
