// --- START OF FILE Navbar2.js ---
import * as React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import HotelIcon from '@mui/icons-material/Hotel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  height: "60px",
  display: "flex",
  justifyContent: "space-around", // Ensures items are evenly spaced
}));

export default function Navbar2() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledBottomNavigation
      showLabels
      sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1 }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        component={Link}
        to="/"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="Trips"
        icon={<ModeOfTravelIcon />}
        component={Link}
        to="/trips"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="Stays"
        icon={<HotelIcon />}
        component={Link}
        to="/accommodations"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <IconButton
        size="large"
        color="inherit"
        onClick={handleMoreClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            marginTop: '10px',
          },
        }}
      >
        <MenuItem onClick={handleMoreClose} component={Link} to="/about-us">
          About Us
        </MenuItem>
        <MenuItem onClick={handleMoreClose} component={Link} to="/contact-us">
          Contact Us
        </MenuItem>
        <MenuItem onClick={handleMoreClose} component={Link} to="/terms-and-conditions">
          Terms & Conditions
        </MenuItem>
        <MenuItem onClick={handleMoreClose} component={Link} to="/admin/login">
          Login
        </MenuItem>
      </Menu>
    </StyledBottomNavigation>
  );
}
// --- END OF FILE ---