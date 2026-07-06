// src/components/common/Navbar.js
// Single responsive navigation: top app bar (all screens) + bottom navigation on mobile.
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import HotelIcon from '@mui/icons-material/Hotel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.85),
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.secondary.contrastText,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
}));

const Logo = styled(Box)(({ theme }) => ({
  width: '140px',
  minWidth: '140px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

// Shared underline-on-hover style for top nav links
const navLinkSx = (theme) => ({
  fontWeight: 600,
  position: 'relative',
  paddingBottom: '4px',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'transparent',
    transform: 'none',
    color: theme.palette.text.primary,
    '&::after': {
      transform: 'scaleX(1)',
      transformOrigin: 'bottom left',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '8px',
    right: '8px',
    bottom: '2px',
    height: '2px',
    backgroundColor: theme.palette.accent.main,
    transform: 'scaleX(0)',
    transformOrigin: 'bottom left',
    transition: 'transform 0.25s ease-out',
  },
});

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  borderTop: `1px solid ${theme.palette.divider}`,
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  height: '60px',
  display: 'flex',
  justifyContent: 'space-around',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  zIndex: theme.zIndex.appBar,
}));

function MobileBottomNav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [value, setValue] = React.useState('home');
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setValue('home');
    } else if (path.startsWith('/trips')) {
      setValue('trips');
    } else if (path.startsWith('/accommodations')) {
      setValue('stays');
    } else if (
      ['/about-us', '/contact-us', '/terms-and-conditions', '/login', '/profile', '/logout'].includes(path)
    ) {
      setValue('more');
    }
  }, [location.pathname]);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
    setValue('more');
  };

  const handleMoreClose = () => setAnchorEl(null);

  return (
    <StyledBottomNavigation
      component="nav"
      aria-label="Primary mobile navigation"
      showLabels
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
    >
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<HomeIcon />}
        component={RouterLink}
        to="/"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="Trips"
        value="trips"
        icon={<ModeOfTravelIcon />}
        component={RouterLink}
        to="/trips"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="Stays"
        value="stays"
        icon={<HotelIcon />}
        component={RouterLink}
        to="/accommodations"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="More"
        value="more"
        icon={<MoreHorizIcon />}
        onClick={handleMoreClick}
        id="more-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? 'more-menu' : undefined}
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <Menu
        id="more-menu"
        aria-labelledby="more-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMoreClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              minWidth: '160px',
            },
          },
        }}
      >
        <MenuItem onClick={handleMoreClose} component={RouterLink} to="/about-us">About Us</MenuItem>
        <MenuItem onClick={handleMoreClose} component={RouterLink} to="/contact-us">Contact Us</MenuItem>
        <MenuItem onClick={handleMoreClose} component={RouterLink} to="/terms-and-conditions">Terms & Conditions</MenuItem>
        {isAuthenticated ? (
          [
            <MenuItem key="profile" onClick={handleMoreClose} component={RouterLink} to="/profile">Profile</MenuItem>,
            <MenuItem key="logout" onClick={handleMoreClose} component={RouterLink} to="/logout">Logout</MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleMoreClose} component={RouterLink} to="/login">Login</MenuItem>
        )}
      </Menu>
    </StyledBottomNavigation>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated: isUserAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          zIndex: theme.zIndex.drawer + 2,
          width: '100%',
          top: 0,
        }}
      >
        <StyledAppBar position="static">
          <Toolbar sx={{ minHeight: '68px', px: 2 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Travel Trail home">
              <Logo>
                <img
                  src="/images/mainLogo.svg"
                  alt="Travel Trail"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Logo>
            </RouterLink>

            <Box sx={{ flexGrow: 1 }} />

            <Box
              component="nav"
              aria-label="Primary navigation"
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: theme.spacing(3),
                alignItems: 'center',
              }}
            >
              <Button variant="text" color="inherit" component={RouterLink} to="/trips" sx={navLinkSx(theme)}>
                Trips
              </Button>
              <Button variant="text" color="inherit" component={RouterLink} to="/accommodations" sx={navLinkSx(theme)}>
                Accommodations
              </Button>
              {isUserAuthenticated || isAdminAuthenticated ? (
                <Button variant="contained" color="primary" component={RouterLink} to="/logout">
                  Logout
                </Button>
              ) : (
                <Button variant="outlined" color="primary" component={RouterLink} to="/login">
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </StyledAppBar>
      </Box>
      {isMobile && <MobileBottomNav />}
    </>
  );
}
