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
  height: '44px',
  marginRight: theme.spacing(2),
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
          px: { xs: 2, md: 4 },
          minHeight: '68px'
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
              sx={{ 
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
              onClick={handleTripMenuOpen}
            >
              Trips
            </Button>
            <Menu
              anchorEl={tripMenuAnchorEl}
              open={Boolean(tripMenuAnchorEl)}
              onClose={handleTripMenuClose}
              PaperProps={{
                sx: {
                  maxHeight: 480,
                  width: '200px',
                  backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(249, 168, 37, 0.95)'
                    : 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              {["Adventure", "Beach", "City Break", "Cultural", "Family", "Hiking", "Luxury", "Nature", "Romantic", "Wildlife", "Honeymoon", "Spiritual"].map(
                (tripTheme) => (
                  <MenuItem 
                    key={tripTheme} 
                    component={RouterLink}
                    to={`/theme/${encodeURIComponent(tripTheme)}`}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action?.selected
                      }
                    }}
                  >
                    {tripTheme}
                  </MenuItem>
                )
              )}
            </Menu>

            <RouterLink to="/accommodations" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button 
                variant="text" 
                color="inherit" 
                sx={{ 
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                Accommodations
              </Button>
            </RouterLink>
            {isUserAuthenticated && (
              <RouterLink to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button 
                  variant="text" 
                  color="inherit" 
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  Profile
                </Button>
              </RouterLink>
            )}
          </Box>

          <Box sx={{ ml: 2 }}>
            {(isUserAuthenticated || isAdminAuthenticated) ? (
              <RouterLink to="/logout" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained"
                  sx={{ 
                    backgroundColor: '#f9a825',
                    color: theme.palette.getContrastText('#f9a825'),
                    borderRadius: '20px',
                    '&:hover': {
                      backgroundColor: '#d18c1f',
                      boxShadow: theme.shadows[2]
                    }
                  }}
                >
                  Logout
                </Button>
              </RouterLink>
            ) : (
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: '20px',
                    borderColor: 'inherit',
                    color: 'inherit',
                    '&:hover': {
                      borderColor: '#d18c1f',
                      backgroundColor: 'rgba(249, 168, 37, 0.1)'
                    }
                  }}
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