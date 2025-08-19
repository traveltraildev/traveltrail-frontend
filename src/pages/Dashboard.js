import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Link,
  Button,
  Card,
  CardContent,
  Stack,
  Icon
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
    ConfirmationNumber, 
    People, 
    CardTravel, 
    Apartment, 
    AddCircle, 
    Settings, 
    Assessment 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, height: '100%' }}>
        <Icon component={icon} sx={{ fontSize: 40, color: color }} />
        <Box>
            <Typography color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight="600">{value}</Typography>
        </Box>
    </Paper>
);

const ActionButton = ({ to, title, icon }) => (
    <Button 
        component={RouterLink} 
        to={to} 
        variant="outlined"
        startIcon={icon}
        sx={{ 
            p: 2, 
            flexDirection: 'column', 
            height: 120, 
            width: '100%',
            justifyContent: 'center'
        }}
    >
        {title}
    </Button>
);

const Dashboard = () => {
  // Mock data - to be replaced with API calls
  const stats = {
    bookings: 125,
    users: 42,
    trips: 18,
    accommodations: 34,
  };

  return (
    <Box sx={{ bgcolor: 'neutral.100', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" fontWeight="700" sx={{ mb: 4 }}>
          Admin Dashboard
        </Typography>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Bookings" value={stats.bookings} icon={ConfirmationNumber} color="primary.main" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Registered Users" value={stats.users} icon={People} color="secondary.dark" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Trips" value={stats.trips} icon={CardTravel} color="success.main" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Listed Stays" value={stats.accommodations} icon={Apartment} color="info.main" />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6} md={3}><ActionButton to="/admin/manage-bookings" title="Manage Bookings" icon={<Settings />} /></Grid>
                <Grid item xs={6} md={3}><ActionButton to="/admin/cms/add-trip" title="Add New Trip" icon={<AddCircle />} /></Grid>
                <Grid item xs={6} md={3}><ActionButton to="/admin/add-accommodation" title="Add New Stay" icon={<AddCircle />} /></Grid>
                <Grid item xs={6} md={3}><ActionButton to="#" title="View Reports" icon={<Assessment />} /></Grid>
            </Grid>
        </Paper>

        {/* We can add tables for recent bookings/users here once the API endpoints are ready */}

      </Container>
    </Box>
  );
};

export default Dashboard;
