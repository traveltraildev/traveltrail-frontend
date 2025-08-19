import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import HamburgerMenu from './HamburgerMenu';

// Custom hook for scroll-based styling
function useElevateOnScroll() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return {
    elevation: trigger ? 4 : 0,
    backgroundColor: trigger ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
    backdropFilter: trigger ? 'blur(8px)' : 'none',
    borderBottom: trigger ? `1px solid ${theme.palette.divider}` : 'none',
  };
}

const theme = createTheme(); // Create a default theme instance to use its properties

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdminAuthenticated, adminLogout } = useAdminAuth();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const scrollStyles = useElevateOnScroll();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    if (isAuthenticated) logout();
    if (isAdminAuthenticated) adminLogout();
  };

  const NavLink = ({ to, children }) => (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: 'text.primary',
        fontWeight: 500,
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      {children}
    </Button>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        ...scrollStyles,
        transition: 'background-color 0.3s ease, border-bottom 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <RouterLink to="/">
            <Box
              component="img"
              src="/images/mainLogo.svg"
              alt="Trishelta Logo"
              sx={{ height: 40, mr: 2 }}
            />
          </RouterLink>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <HamburgerMenu />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/trips">Trips</NavLink>
              <NavLink to="/accommodations">Stays</NavLink>
              <NavLink to="/about-us">About</NavLink>
              <NavLink to="/contact-us">Contact</NavLink>

              {(isAuthenticated || isAdminAuthenticated) ? (
                <>
                  <Tooltip title="Profile & Settings">
                    <IconButton onClick={handleMenu} size="small">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
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
                  disableElevation
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

// Dummy createTheme call to satisfy the linter if theme is used in scrollStyles
function createTheme() {
    return { palette: { divider: 'rgba(0, 0, 0, 0.12)' } };
}
