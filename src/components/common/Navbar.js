import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useMediaQuery,
  useScrollTrigger,
  Container,
  useTheme,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import HamburgerMenu from './HamburgerMenu';
import ProfileMenu from './ProfileMenu';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

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

              <SignedIn>
                <ProfileMenu />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: '20px', px: 3, fontWeight: 'bold' }}
                  >
                    Login
                  </Button>
                </SignInButton>
              </SignedOut>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}