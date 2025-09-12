import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  useTheme,
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const ProfileHeader = ({ user }) => {
  const theme = useTheme();

  if (!user) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 4,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Avatar
        src={user.imageUrl}
        sx={{
          width: { xs: 90, sm: 110 },
          height: { xs: 90, sm: 110 },
          fontSize: '3.5rem',
          bgcolor: 'primary.main'
        }}
      >
        {user.fullName?.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography variant="h4" component="h1" fontWeight="700">
          {user.fullName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user.emailAddresses[0]?.emailAddress}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {(user.firstName || user.fullName)
            ? `Welcome to your profile, ${user.firstName || user.fullName}.`
            : 'Welcome to your profile.'
          }
        </Typography>
      </Box>
      <Button
        component={Link}
        to="/profile-settings"
        variant="outlined"
        startIcon={<Edit />}
        sx={{ mt: { xs: 2, sm: 0 } }}
      >
        Edit Profile
      </Button>
    </Paper>
  );
};

export default ProfileHeader;
