import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Link as RouterLink
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api/userAPI';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      await updateUserProfile(user._id, formData);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update profile. Please try again.' });
      console.error('Error updating profile:', error);
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
        <Typography variant="h5">Please log in to edit your profile.</Typography>
        <Button component={RouterLink} to="/login" variant="contained" sx={{mt: 2}}>Login</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'neutral.100', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="600">Edit Profile</Typography>
              <Typography color="text.secondary">Update your personal information below.</Typography>
            </Box>

            {notification.message && 
              <Alert severity={notification.type} sx={{ width: '100%' }}>
                {notification.message}
              </Alert>
            }

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ px: 4 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/profile')}>
                            Cancel
                        </Button>
                    </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditProfilePage;
