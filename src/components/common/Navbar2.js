import React, { useState, useEffect } from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import {
  Home, 
  Explore, 
  Apartment, 
  MoreHoriz, 
  AccountCircle, 
  Logout, 
  Login, 
  Info, 
  ContactSupport
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function Navbar2() {
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const isAuthenticated = isSignedIn;
  const isAdminAuthenticated = user?.publicMetadata?.role === 'admin';
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setValue(0);
    else if (path.startsWith('/trips')) setValue(1);
    else if (path.startsWith('/accommodations')) setValue(2);
    else setValue(3); // "More" or other pages
  }, [location.pathname]);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1200,
        borderTop: '1px solid',
        borderColor: 'neutral.200',
        borderRadius: '16px 16px 0 0',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        overflow: 'hidden'
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue !== 3) {
            setValue(newValue);
          }
        }}
      >
        <BottomNavigationAction component={Link} to="/" label="Home" icon={<Home />} />
        <BottomNavigationAction component={Link} to="/trips" label="Trips" icon={<Explore />} />
        <BottomNavigationAction component={Link} to="/accommodations" label="Stays" icon={<Apartment />} />
        <BottomNavigationAction label="More" icon={<MoreHoriz />} onClick={handleMoreClick} />
      </BottomNavigation>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{ sx: { mb: 1, borderRadius: 2, boxShadow: 3 } }}
      >
        {(isAuthenticated || isAdminAuthenticated) ? (
          <Box>
            <MenuItem component={Link} to={isAdminAuthenticated ? '/admin/dashboard' : '/profile'} onClick={handleClose}>
              <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to="/logout" onClick={handleClose}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Box>
        ) : (
          <MenuItem component={Link} to="/login" onClick={handleClose}>
            <ListItemIcon><Login fontSize="small" /></ListItemIcon>
            <ListItemText>Login</ListItemText>
          </MenuItem>
        )}
        <MenuItem component={Link} to="/about-us" onClick={handleClose}>
          <ListItemIcon><Info fontSize="small" /></ListItemIcon>
          <ListItemText>About Us</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/contact-us" onClick={handleClose}>
          <ListItemIcon><ContactSupport fontSize="small" /></ListItemIcon>
          <ListItemText>Contact</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
