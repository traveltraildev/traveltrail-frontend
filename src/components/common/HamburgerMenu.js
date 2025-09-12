import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Box, Typography, Divider, Avatar } from '@mui/material';

export default function HamburgerMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const isTransparent = isHomePage && !trigger;
  const iconColor = isTransparent ? 'white' : theme.palette.text.primary;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        aria-label="menu"
        onClick={handleMenuOpen}
        sx={{ color: iconColor }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            minWidth: 250,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {user && (
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
        )}
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleMenuClose} component={Link} to="/">
          Home
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/trips">
          Trips
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/accommodations">
          Stays
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/about-us">
          About
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/contact-us">
          Contact
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {user ? (
          <>
            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
              Ur Bookings
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/profile-settings">
              Your Profile
            </MenuItem>
            {user.publicMetadata.role === 'admin' && (
              <MenuItem onClick={handleMenuClose} component={Link} to="/admin/dashboard">
                Admin Dashboard
              </MenuItem>
            )}
            <MenuItem>
              <SignOutButton />
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleMenuClose} component={Link} to="/sign-in">
            Login
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
