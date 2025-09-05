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
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { updateUserProfile } from '../api/userAPI';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        phone: user.phoneNumbers[0]?.phoneNumber || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      await updateUserProfile(user.id, formData, getToken);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update profile. Please try again.' });
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  if (!isSignedIn) {
    return (
      <Container sx={{textAlign: 'center', py: 12}}>
        <Typography variant="h5">Please log in to edit your profile.</Typography>
        <Button component={RouterLink} to="/sign-in" variant="contained" sx={{mt: 2}}>Login</Button>
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
                        <Button
                          variant="text"
                          component="a"
                          href="/account"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ ml: 1 }}
                        >
                          Manage account (email / password)
                        </Button>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      To change your email or password, use the Clerk account management page which opens in a new tab.
                    </Typography>
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
