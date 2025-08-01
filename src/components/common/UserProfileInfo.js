import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';

const UserProfileInfo = ({ user }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {/* Name Field */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mr: 2, flexShrink: 0 }}
            >
              <strong>Name:</strong>
            </Typography>
            <Typography variant="body1">{user.name}</Typography>
          </Box>
        </Grid>

        {/* Email Field */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mr: 2, flexShrink: 0 }}
            >
              <strong>Email:</strong>
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
        </Grid>

        {/* Phone Field */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mr: 2, flexShrink: 0 }}
            >
              <strong>Phone:</strong>
            </Typography>
            <Typography variant="body1">{user.phone}</Typography>
          </Box>
        </Grid>

        {/* Username Field */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mr: 2, flexShrink: 0 }}
            >
              <strong>Username:</strong>
            </Typography>
            <Typography variant="body1">{user.username}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Link to="/edit-profile" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'var(--primary-500)',
              color: 'white',
              '&:hover': { bgcolor: 'var(--primary-600)' },
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              flex: 1,
              minWidth: '120px'
            }}
          >
            Edit Profile
          </Button>
        </Link>
        <Link to="/change-password" style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            sx={{
              bgcolor: 'var(--neutral-50)',
              color: 'var(--primary-500)',
              '&:hover': { bgcolor: 'var(--neutral-100)' },
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              flex: 1,
              minWidth: '120px'
            }}
          >
            Change Password
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default UserProfileInfo;