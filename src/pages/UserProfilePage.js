import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Stack,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import UserProfileInfo from '../components/common/UserProfileInfo';
import UserBookingHistory from '../components/common/UserBookingHistory';
import { Person, History } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: {xs: 2, md: 3} }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress />
        </Box>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography variant="h5">Please log in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'neutral.100', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Profile Header */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 2 }}>
            <Avatar sx={{ width: 70, height: 70, fontSize: '2rem', bgcolor: 'primary.main' }}>
                {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
                <Typography variant="h4" component="h1" fontWeight="600">{user.name}</Typography>
                <Typography variant="body1" color="text.secondary">{user.email}</Typography>
            </Box>
        </Paper>

        {/* Tabs and Content */}
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="User profile tabs" 
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab icon={<Person />} iconPosition="start" label="Profile Details" />
                <Tab icon={<History />} iconPosition="start" label="Booking History" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <UserProfileInfo user={user} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <UserBookingHistory userId={user._id} />
            </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserProfilePage;
