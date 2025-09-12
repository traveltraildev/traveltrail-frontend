import React from 'react';
import { Box, Container, Paper, useTheme } from '@mui/material';
import { UserProfile } from '@clerk/clerk-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ProfileSettingsPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <UserProfile />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ProfileSettingsPage;
