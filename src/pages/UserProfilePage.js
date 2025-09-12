import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Button,
  Avatar
} from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import UserBookingHistory from '../components/common/UserBookingHistory';
import { Edit } from '@mui/icons-material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';

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
        <Paper elevation={0} sx={{ p: {xs:2, sm:4}, mb: 4, display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, alignItems: 'center', gap: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Avatar src={user.imageUrl} sx={{ width: 90, height: 90, fontSize: '3rem', bgcolor: 'primary.main' }}>
                {user.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{flexGrow: 1, textAlign: {xs: 'center', sm: 'left'}}}>
                <Typography variant="h4" component="h1" fontWeight="600">{user.fullName}</Typography>
                <Typography variant="body1" color="text.secondary">{user.emailAddresses[0]?.emailAddress}</Typography>
            </Box>
            <Button component={Link} to="/profile-settings" variant="outlined" startIcon={<Edit />}>Edit Profile</Button>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
            <UserBookingHistory userId={user.id} />
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default UserProfilePage;