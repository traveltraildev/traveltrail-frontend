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
  Grid,
  Avatar
} from '@mui/material';
import { Email, Phone, Person, Edit, Lock } from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';

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
  // user = server-side profile object
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  // Prefer Clerk-managed fields, fall back to server-side profile
  const name = (clerkLoaded && clerkUser?.fullName) || user?.name || '';
  const email = (clerkLoaded && clerkUser?.primaryEmailAddress?.emailAddress) || user?.email || '';
  const phone = (clerkLoaded && clerkUser?.phoneNumbers && clerkUser.phoneNumbers.length > 0 && clerkUser.phoneNumbers[0]) || user?.phone || 'Not provided';
  const username = user?.username || (clerkLoaded && clerkUser?.username) || '';
  const avatarUrl = (clerkLoaded && clerkUser?.profileImageUrl) || user?.avatarUrl || '';

  const profileItems = [
    { label: 'Name', value: name, icon: <Person /> },
    { label: 'Email', value: email, icon: <Email /> },
    { label: 'Phone', value: phone, icon: <Phone /> },
    { label: 'Username', value: username, icon: <Person /> },
  ];

  return (
    <Box>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar src={avatarUrl} alt={name} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h5" fontWeight="600">Account Details</Typography>
            {name && <Typography variant="body2" color="text.secondary">{name}</Typography>}
            {email && <Typography variant="body2" color="text.secondary">{email}</Typography>}
          </Box>
        </Stack>
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