// src/components/common/Navbar.js
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(253, 216, 53, 0.7)' 
    : 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.getContrastText('#fdd835b3'),
  boxShadow: 'none',
  transition: 'all 0.3s ease',
}));

const Logo = styled(Box)(({ theme }) => ({
  width: '140px',
  minWidth: '140px',
  height: '44px',
  marginLeft: 0,
  marginRight: theme.spacing(2),
  paddingLeft: 0,
  position: 'absolute', // Force logo to left edge
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

export default function Navbar() {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const { isAuthenticated: isUserAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const theme = useTheme();
  const [tripMenuAnchorEl, setTripMenuAnchorEl] = React.useState(null);

  const handleTripMenuOpen = (event) => {
    setTripMenuAnchorEl(event.currentTarget);
  };

  const handleTripMenuClose = () => {
    setTripMenuAnchorEl(null);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: 'fixed',
        zIndex: (theme) => theme.zIndex.drawer + 2,
        width: '100%',
        top: 0,
      }}
    >
      <StyledAppBar position="static">
        <Toolbar sx={{ 
          px: 0,
          pl: 0,
          minHeight: '68px',
          position: 'relative', // Allow absolute positioning of logo
        }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo>
              <img
                src="/images/mainLogo.svg"
                alt="Travel Trail"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
                }}
              />
            </Logo>
          </RouterLink>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: theme.spacing(3),
            alignItems: 'center'
          }}>
            <Button
              variant="text"
              color="inherit"
              component={RouterLink}
              to="/trips"
              sx={{
                fontWeight: 600,
                position: 'relative', // Required for the pseudo-element
                paddingBottom: '4px', // Space for the underline
                overflow: 'hidden', // Prevent issues with scaling if any text overflows
                '&:hover': {
                  backgroundColor: 'transparent', // Assuming no background color change on hover for these links
                  transform: 'none', // Override the global button theme's hover scale effect
                  color: (theme) => theme.palette.text.primary, // Ensure text color remains consistent or as desired
                  '&::after': {
                    transform: 'scaleX(1)', // Show underline on hover
                    transformOrigin: 'bottom left',
                  }
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '8px', // Adjust to align with button padding
                  right: '8px', // Adjust to align with button padding
                  bottom: '2px', // Adjust vertical position of underline
                  height: '2px', // Thickness of the underline
                  backgroundColor: (theme) => theme.palette.accent.main, // Use accent color from theme
                  transform: 'scaleX(0)', // Initially hidden
                  transformOrigin: 'bottom left',
                  transition: 'transform 0.25s ease-out', // Animation for the underline
                }
              }}
            >
              Trips
            </Button>
            
            <RouterLink to="/accommodations" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button 
                variant="text" 
                color="inherit" 
                sx={{
                  fontWeight: 600,
                  position: 'relative', // Required for the pseudo-element
                  paddingBottom: '4px', // Space for the underline
                  overflow: 'hidden', // Prevent issues with scaling if any text overflows
                  '&:hover': {
                    backgroundColor: 'transparent', // Assuming no background color change on hover for these links
                    transform: 'none', // Override the global button theme's hover scale effect
                    color: (theme) => theme.palette.text.primary, // Ensure text color remains consistent or as desired
                    '&::after': {
                      transform: 'scaleX(1)', // Show underline on hover
                      transformOrigin: 'bottom left',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '8px', // Adjust to align with button padding
                    right: '8px', // Adjust to align with button padding
                    bottom: '2px', // Adjust vertical position of underline
                    height: '2px', // Thickness of the underline
                    backgroundColor: (theme) => theme.palette.accent.main, // Use accent color from theme
                    transform: 'scaleX(0)', // Initially hidden
                    transformOrigin: 'bottom left',
                    transition: 'transform 0.25s ease-out', // Animation for the underline
                  }
                }}
              >
                Accommodations
              </Button>
            </RouterLink>
            {(isUserAuthenticated || isAdminAuthenticated) ? (
              <RouterLink to="/logout" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" // Changed
                  color="primary" // Changed
                  // Removed sx props
                >
                  Logout
                </Button>
              </RouterLink>
            ) : (
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined" // Changed
                  color="primary" // Changed
                  // Removed sx props
                >
                  Login
                </Button>
              </RouterLink>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}