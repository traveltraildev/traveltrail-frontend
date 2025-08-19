import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { changeUserPassword } from '../api/userAPI';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const ChangePasswordPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (formData.newPassword.length < 8) {
      setNotification({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }
    
    setLoading(true);
    try {
      await changeUserPassword(user._id, formData);
      setNotification({ type: 'success', message: 'Password changed successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setNotification({ type: 'error', message: error.message || 'Failed to change password. Please check your current password.' });
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  if (!isAuthenticated) {
    return (
      <Container sx={{textAlign: 'center', py: 12}}>
        <Typography variant="h5">Please log in to change your password.</Typography>
        <Button component={RouterLink} to="/login" variant="contained" sx={{mt: 2}}>Login</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'neutral.100', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="600">Change Password</Typography>
              <Typography color="text.secondary">For your security, we recommend using a strong password.</Typography>
            </Box>

            {notification.message && 
              <Alert severity={notification.type} sx={{ width: '100%' }}>
                {notification.message}
              </Alert>
            }

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  helperText="Must be at least 8 characters long."
                  required
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ px: 4 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Update Password'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/profile')}>
                        Cancel
                    </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;
