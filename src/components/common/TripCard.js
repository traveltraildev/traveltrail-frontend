import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Stack, Box, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth, useClerk } from '@clerk/clerk-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const TripCard = ({ trip }) => {
  const theme = useTheme();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { addItem, removeItem, isWishlisted } = useWishlist();

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (isWishlisted(trip._id)) {
      removeItem(trip._id);
    } else {
      addItem(trip._id, 'Trip');
    }
  };

  return (
    <Card sx={{ minWidth: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] }, boxShadow: theme.shadows[3], position: 'relative' }}>
      <IconButton
        aria-label="add to wishlist"
        onClick={handleWishlistClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          zIndex: 1 // Ensure button is above the image
        }}
      >
        {isWishlisted(trip._id) ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardMedia
        component="img"
        height="220"
        image={trip?.images[0] || "/images/placeholder.jpg"}
        alt={trip?.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>{trip.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{trip.destination}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={`${trip.daysCount} Days`} size="small" variant="outlined" />
          <Chip label={`${trip.nightsCount} Nights`} size="small" variant="outlined" />
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">₹{trip.price?.toLocaleString()}</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={`/trips/${trip._id}`} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  );
};

export default TripCard;
