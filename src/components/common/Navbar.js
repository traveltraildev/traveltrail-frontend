import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useMediaQuery,
  useScrollTrigger,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import HamburgerMenu from './HamburgerMenu';

const NavLink = ({ to, children, isTransparent }) => {
  const theme = useTheme();
  const textColor = isTransparent ? 'white' : theme.palette.text.primary;
  const hoverBg = isTransparent ? 'rgba(255, 255, 255, 0.1)' : theme.palette.action.hover;

  return (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: textColor,
        fontWeight: 500,
        fontSize: '1rem',
        textTransform: 'none',
        textShadow: isTransparent ? '0px 0px 8px rgba(0,0,0,0.5)' : 'none',
        '&:hover': { 
          backgroundColor: hoverBg,
        },
      }}
    >
      {children}
    </Button>
  );
};

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdminAuthenticated, adminLogout } = useAdminAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    if (isAuthenticated) logout();
    if (isAdminAuthenticated) adminLogout();
  };

  const isTransparent = isHomePage && !trigger;

  const appBarBackground = isTransparent 
    ? 'rgba(0, 0, 0, 0.2)' // Subtle dark overlay for transparent state
    : theme.palette.background.paper;

  const appBarColor = isTransparent 
    ? 'white'
    : theme.palette.text.primary;

  const appBarElevation = isTransparent ? 0 : 4;
  const appBarBorderBottom = isTransparent ? 'none' : `1px solid ${theme.palette.divider}`;

  return (
    <AppBar
      position="fixed"
      elevation={appBarElevation}
      sx={{
        background: appBarBackground,
        backdropFilter: isTransparent ? 'none' : 'blur(10px)',
        transition: theme.transitions.create(['background', 'box-shadow', 'backdrop-filter'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.short,
        }),
        borderBottom: appBarBorderBottom,
        boxShadow: appBarElevation > 0 ? theme.shadows[4] : 'none',
        color: appBarColor,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <RouterLink to="/">
            <Box
              component="img"
              src="/images/mainLogo.svg"
              alt="TravelTrail Logo"
              sx={{
                height: 48,
                mr: 2,
                filter: isTransparent ? 'brightness(0) invert(1)' : 'none', // Invert for white logo
                transition: 'filter 0.3s ease',
              }}
            />
          </RouterLink>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <HamburgerMenu />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NavLink to="/" isTransparent={isTransparent}>Home</NavLink>
              <NavLink to="/trips" isTransparent={isTransparent}>Trips</NavLink>
              <NavLink to="/accommodations" isTransparent={isTransparent}>Stays</NavLink>
              <NavLink to="/about-us" isTransparent={isTransparent}>About</NavLink>
              <NavLink to="/contact-us" isTransparent={isTransparent}>Contact</NavLink>

              {(isAuthenticated || isAdminAuthenticated) ? (
                <>
                  <Tooltip title="Profile & Settings">
                    <IconButton onClick={handleMenu} size="small" sx={{color: appBarColor}}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{ sx: { mt: 1.5, borderRadius: 2 } }}
                  >
                    <MenuItem component={RouterLink} to={isAdminAuthenticated ? '/admin/dashboard' : '/profile'} onClick={handleClose}>Dashboard</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: '20px', px: 3, fontWeight: 'bold' }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}