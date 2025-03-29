// --- START OF FILE HamburgerMenu.js ---
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
        edge="end"
        color="black"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/">
          Home
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/about-us">
          About Us
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/contact-us">
          Contact Us
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/terms-and-conditions">
          Terms & Conditions
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/admin/login">
          Login
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HamburgerMenu;
// --- END OF FILE ---