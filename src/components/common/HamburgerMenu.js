// src/components/common/HamburgerMenu.js
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function HamburgerMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isAuthenticated: isUserAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();

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
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Link to="/trips" style={{ textDecoration: 'none', color: 'inherit' }}>
            Trips
          </Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Link to="/accommodations" style={{ textDecoration: 'none', color: 'inherit' }}>
            Accommodations
          </Link>
        </MenuItem>
        {isUserAuthenticated && (
          <MenuItem onClick={handleMenuClose}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              Profile
            </Link>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}