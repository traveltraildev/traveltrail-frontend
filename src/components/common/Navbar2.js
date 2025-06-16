// --- START OF FILE Navbar2.js ---
import * as React from "react";
import { BottomNavigation, BottomNavigationAction, useTheme, Menu, MenuItem } from "@mui/material"; // Added Menu, MenuItem
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import HotelIcon from '@mui/icons-material/Hotel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
// IconButton import removed as it's no longer directly used for More button.
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../../context/AuthContext'; // Added useAuth

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1], // Use theme shadow
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  height: "60px",
  display: "flex",
  justifyContent: "space-around",
  position: "fixed",
  bottom: 0,
  width: "100%",
  zIndex: theme.zIndex.mobileStepper, // Use theme zIndex
}));

export default function Navbar2() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [value, setValue] = React.useState('home'); // State for selected action
  const location = useLocation(); // Hook to get current location

  const { isAuthenticated } = useAuth(); // Get auth state

  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setValue('home');
    } else if (path.startsWith('/trips')) {
      setValue('trips');
    } else if (path.startsWith('/accommodations')) {
      setValue('stays');
    } else if (['/about-us', '/contact-us', '/terms-and-conditions', '/login', '/profile', '/logout'].includes(path)) { // Updated "More" active paths
      setValue('more');
    }
    // If not any of the specific paths, it might fall back to 'home' or the last set value.
    // Or, ensure a default if no match, e.g. else setValue('home');
  }, [location.pathname]);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
    setValue('more'); // Ensure "More" is set as active when its menu is opened
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
    // When menu closes, value is updated by useEffect based on current path.
    // If user navigated to a page within "More" menu, "More" will remain active.
    // If user just closed menu without navigating, path hasn't changed, useEffect handles it.
  };

  const handleMenuCloseAndNavigate = () => {
    setAnchorEl(null);
    // Value will be updated by useEffect when location changes.
  };

  return (
    <StyledBottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        // setValue(newValue) here provides immediate visual feedback.
        // For "More", its own onClick handles opening the menu.
        // For navigation items, Link handles navigation, and useEffect syncs state.
        // This explicit setValue ensures the visual state updates even if Link navigation is slow
        // or if the action doesn't navigate (like "More" opening a menu).
        setValue(newValue);
        // Note: if `newValue` is "more", `handleMoreClick` is NOT called by this `onChange`.
        // The `onClick` on the "More" `BottomNavigationAction` itself handles opening the menu.
      }}
    >
      <BottomNavigationAction
        label="Home"
        value="home" // Assign value
        icon={<HomeIcon />}
        component={Link}
        to="/"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="Trips"
        value="trips" // Assign value
        icon={<ModeOfTravelIcon />}
        component={Link}
        to="/trips"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <BottomNavigationAction
        label="Stays"
        value="stays" // Assign value
        icon={<HotelIcon />}
        component={Link}
        to="/accommodations"
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      {/* Changed IconButton to BottomNavigationAction for "More" */}
      <BottomNavigationAction
        label="More"
        value="more" // Assign value
        icon={<MoreHorizIcon />}
        onClick={handleMoreClick} // Keep onClick to open menu
        id="more-button" // Added id
        aria-haspopup="true" // Added aria-haspopup
        aria-expanded={open} // Added aria-expanded
        aria-controls={open ? 'more-menu' : undefined} // Added aria-controls
        sx={{ '& .MuiBottomNavigationAction-label': { mt: 1 } }}
      />
      <Menu
        id="more-menu" // Added id
        aria-labelledby="more-button" // Added aria-labelledby
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
            marginTop: '10px', // This specific marginTop might need adjustment if menu position is off
          },
          sx: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            minWidth: '150px',
          }
        }}
      >
        <MenuItem onClick={handleMenuCloseAndNavigate} component={Link} to="/about-us">About Us</MenuItem>
        <MenuItem onClick={handleMenuCloseAndNavigate} component={Link} to="/contact-us">Contact Us</MenuItem>
        <MenuItem onClick={handleMenuCloseAndNavigate} component={Link} to="/terms-and-conditions">Terms & Conditions</MenuItem>

        {isAuthenticated ? (
          [ // Use an array or React.Fragment
            <MenuItem key="profile" onClick={handleMenuCloseAndNavigate} component={Link} to="/profile">Profile</MenuItem>,
            <MenuItem key="logout" onClick={handleMenuCloseAndNavigate} component={Link} to="/logout">Logout</MenuItem>
          ]
        ) : (
          <MenuItem onClick={handleMenuCloseAndNavigate} component={Link} to="/login">Login</MenuItem>
        )}
      </Menu>
    </StyledBottomNavigation>
  );
}
// --- END OF FILE ---