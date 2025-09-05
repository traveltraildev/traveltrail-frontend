import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotAuthorized = () => (
  <Container maxWidth="sm" sx={{ py: 8 }}>
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>Access denied</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You don't have permission to view this page. If you think this is a mistake, contact your administrator.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button component={Link} to="/" variant="contained">Back to Home</Button>
        <Button component={Link} to="/profile" variant="outlined">My Profile</Button>
      </Box>
    </Paper>
  </Container>
);

export default NotAuthorized;
