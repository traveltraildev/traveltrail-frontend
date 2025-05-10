// src/components/common/UserProfile.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfileInfo from './UserProfileInfo';
import UserBookingHistory from './UserBookingHistory';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 120px)',
          backgroundColor: 'var(--neutral-50)',
        }}
      >
        <Typography variant="body1" sx={{ color: 'var(--primary-500)' }}>
          Please log in to view your profile
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 8, pb: 6, backgroundColor: 'var(--neutral-50)' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'var(--primary-500)',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Your Profile
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white'
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'var(--primary-500)', mb: 3 }}
              >
                Personal Information
              </Typography>
              <UserProfileInfo user={user} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white'
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'var(--primary-500)', mb: 3 }}
              >
                Booking History
              </Typography>
              <UserBookingHistory userId={user._id} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};s

export default UserProfile;