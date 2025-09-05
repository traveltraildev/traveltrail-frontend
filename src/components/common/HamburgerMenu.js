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

  const handleLogout = () => {
    handleMenuClose();
    navigate('/'); // Redirect to home after logout
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
        PaperProps={{ sx: { mt: 1.5, borderRadius: 2 } }}
      >
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

        {user ? (
          <>
            <MenuItem onClick={handleMenuClose} component={Link} to={user.publicMetadata.role === 'admin' ? '/admin/dashboard' : '/profile'}>
              Dashboard
            </MenuItem>
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
