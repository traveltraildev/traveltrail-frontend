import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import UserProfileInfo from '../components/common/UserProfileInfo';
import UserBookingHistory from '../components/common/UserBookingHistory';

const UserProfilePage = () => {
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
    <Box sx={{ pt: 12, pb: 8, backgroundColor: 'var(--neutral-50)' }}>
      <Container maxWidth="md">
        {/* Profile Header */}
        <Box
          sx={{
            backgroundColor: 'white',
            p: 4,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            mb: 6,
          }}
        >
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

        {/* Profile Content */}
        <Grid container spacing={4}>
          {/* Personal Information Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: 'white',
                p: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                mb: 4,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'var(--primary-500)', mb: 3 }}
              >
                Personal Information
              </Typography>
              <UserProfileInfo user={user} />
            </Box>
          </Grid>

          {/* Booking History Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: 'white',
                p: 4,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'var(--primary-500)', mb: 3 }}
              >
                Booking History
              </Typography>
              <UserBookingHistory userId={user._id} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserProfilePage;