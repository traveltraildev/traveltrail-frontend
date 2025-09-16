import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Hotel as HotelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isSignedIn } = useUser();

  const [value, setValue] = useState(location.pathname);

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (newValue === '/profile' && !isSignedIn) {
            navigate('/sign-in');
          } else {
            setValue(newValue);
            navigate(newValue);
          }
        }}
        sx={{
          bgcolor: theme.palette.background.paper,
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
        <BottomNavigationAction label="Trips" value="/trips" icon={<ExploreIcon />} />
        <BottomNavigationAction label="Stays" value="/accommodations" icon={<HotelIcon />} />
        <BottomNavigationAction label="Profile" value="/profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
