import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  Divider
} from '@mui/material';
import { Email, Phone, Person, Edit, Lock } from '@mui/icons-material';

const UserProfileInfo = ({ user }) => {
  const profileItems = [
    { label: 'Name', value: user.name, icon: <Person /> },
    { label: 'Email', value: user.email, icon: <Email /> },
    { label: 'Phone', value: user.phone || 'Not provided', icon: <Phone /> },
    { label: 'Username', value: user.username, icon: <Person /> },
  ];

  return (
    <Box>
      <List dense sx={{ mb: 3 }}>
        {profileItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <ListItem>
              <ListItemIcon sx={{minWidth: 40}}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label}
                secondary={item.value}
                primaryTypographyProps={{ fontWeight: '500', color: 'text.secondary' }}
                secondaryTypographyProps={{ fontWeight: '600', color: 'text.primary', variant: 'body1' }}
              />
            </ListItem>
            {index < profileItems.length - 1 && <Divider component="li" variant="inset" />}
          </React.Fragment>
        ))}
      </List>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
        <Button
          component={RouterLink}
          to="/edit-profile"
          variant="contained"
          startIcon={<Edit />}
          fullWidth
        >
          Edit Profile
        </Button>
        <Button
          component={RouterLink}
          to="/change-password"
          variant="outlined"
          startIcon={<Lock />}
          fullWidth
        >
          Change Password
        </Button>
      </Stack>
    </Box>
  );
};

export default UserProfileInfo;
