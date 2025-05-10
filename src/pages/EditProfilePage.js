// src/pages/EditProfilePage.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import EditProfile from '../components/common/EditProfile';

const EditProfilePage = () => {
  const { isAuthenticated } = useAuth();

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
          Please log in to edit your profile
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 12, pb: 8, backgroundColor: 'var(--neutral-50)' }}>
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: 'white',
            p: 6,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
            Edit Profile
          </Typography>
          <EditProfile />
        </Box>
      </Container>
    </Box>
  );
};

export default EditProfilePage;