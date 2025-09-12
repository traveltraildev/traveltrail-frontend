import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Button,
  Stack
} from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import UserBookingHistory from '../components/common/UserBookingHistory';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import ProfileHeader from '../components/Profile/ProfileHeader';

const UserProfilePage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const theme = useTheme();

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isSignedIn || !user) {
    return (
      <>
        <Navbar />
        <Container sx={{ textAlign: 'center', py: 15 }}>
          <Typography variant="h4">Please log in</Typography>
          <Typography color="text.secondary" sx={{mt: 1}}>You need to be logged in to view your profile.</Typography>
          <Button component={Link} to="/sign-in" variant="contained" sx={{mt: 3}}>Login</Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={4}>
          <ProfileHeader user={user} />

          {/* --- Improved Booking History Section --- */}
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden', 
              border: `1px solid ${theme.palette.divider}` 
            }}
          >
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight="600">Booking History</Typography>
              <Typography variant="body2" color="text.secondary">A list of your past and upcoming trips.</Typography>
            </Box>
            <UserBookingHistory userId={user.id} />
          </Paper>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
};

export default UserProfilePage;
