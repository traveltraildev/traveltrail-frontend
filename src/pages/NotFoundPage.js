// src/pages/NotFoundPage.js
import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pt: { xs: 12, md: 14 },
          pb: 8,
        }}
      >
        <ExploreOffIcon
          sx={{ fontSize: 96, color: 'accent.main', mb: 3 }}
          aria-hidden="true"
        />
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Looks like you've wandered off the trail.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" component={RouterLink} to="/">
            Back to Home
          </Button>
          <Button variant="outlined" color="primary" component={RouterLink} to="/trips">
            Browse Trips
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
