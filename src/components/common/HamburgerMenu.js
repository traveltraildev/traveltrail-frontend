// --- START OF FILE src/components/common/HamburgerMenu.js ---
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
        aria-label="Main Menu" // Updated aria-label to "Main Menu" as it's now for front-end pages
        aria-controls="hamburger-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <MenuIcon /> {/* Hamburger Icon */}
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
        <MenuItem onClick={handleMenuClose} component={Link} to="/about-us"> {/* Link to About Us Page */}
          About Us
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/contact-us"> {/* Link to Contact Us Page */}
          Contact Us
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/terms-and-conditions"> {/* Link to Terms & Conditions Page */}
          Terms & Conditions
        </MenuItem>
        {/* REMOVED CMS Admin Panel Link */}
      </Menu>
    </div>
  );
};

export default HamburgerMenu;
// --- END OF FILE src/components/common/HamburgerMenu.js ---