
import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useTheme } from '@mui/material/styles';

export default function ProfileMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen} size="small">
        <Avatar 
          src={user?.imageUrl} 
          alt={user?.fullName} 
          sx={{ 
            width: 40, 
            height: 40,
            border: `2px solid ${theme.palette.primary.main}`
          }} 
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: 240,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar 
            src={user?.imageUrl} 
            alt={user?.fullName} 
            sx={{ 
              width: 60, 
              height: 60, 
              mx: 'auto', 
              mb: 1,
              border: `3px solid ${theme.palette.primary.main}`
            }} 
          />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>{user?.fullName}</Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {user?.primaryEmailAddress?.emailAddress}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText primary="Ur Bookings" />
        </MenuItem>
        <MenuItem component={Link} to="/profile-settings" onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: theme.palette.primary.main }} />
          </ListItemIcon>
          <ListItemText primary="Your Profile" />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
