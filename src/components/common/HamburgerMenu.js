// Replace the existing HamburgerMenu component with this
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
        aria-label="Main Menu"
        aria-controls="hamburger-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="hamburger-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/about-us">
          About Us
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/contact-us">
          Contact Us
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          component={Link}
          to="/terms-and-conditions"
        >
          Terms & Conditions
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HamburgerMenu;