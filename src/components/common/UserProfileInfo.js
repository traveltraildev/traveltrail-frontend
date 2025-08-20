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
  Divider,
  Grid
} from '@mui/material';
import { Email, Phone, Person, Edit, Lock } from '@mui/icons-material';

const InfoItem = ({icon, label, value}) => (
    <ListItem>
        <ListItemIcon sx={{minWidth: 42, color: 'primary.main'}}>{icon}</ListItemIcon>
        <ListItemText 
            primary={label}
            secondary={value}
            primaryTypographyProps={{ fontWeight: '500', color: 'text.secondary' }}
            secondaryTypographyProps={{ fontWeight: '600', color: 'text.primary', variant: 'body1' }}
        />
    </ListItem>
)

const UserProfileInfo = ({ user }) => {
  const profileItems = [
    { label: 'Name', value: user.name, icon: <Person /> },
    { label: 'Email', value: user.email, icon: <Email /> },
    { label: 'Phone', value: user.phone || 'Not provided', icon: <Phone /> },
    { label: 'Username', value: user.username, icon: <Person /> },
  ];

  return (
    <Box>
        <Typography variant="h5" fontWeight="600" sx={{mb: 2}}>Account Details</Typography>
        <List dense>
            <Grid container spacing={1}>
                {profileItems.map((item) => (
                    <Grid item xs={12} sm={6} key={item.label}>
                        <InfoItem {...item} />
                    </Grid>
                ))}
            </Grid>
        </List>

      <Divider sx={{my: 3}}/>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
        <Button
          component={RouterLink}
          to="/change-password"
          variant="outlined"
          startIcon={<Lock />}
        >
          Change Password
        </Button>
      </Stack>
    </Box>
  );
};

export default UserProfileInfo;