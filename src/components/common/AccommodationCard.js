import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Stack, Box, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth, useClerk } from '@clerk/clerk-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const AccommodationCard = ({ accommodation }) => {
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

    if (isWishlisted(accommodation._id)) {
      removeItem(accommodation._id);
    } else {
      addItem(accommodation._id, 'Accommodation');
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
        {isWishlisted(accommodation._id) ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardMedia
        component="img"
        height="220"
        image={accommodation?.images[0] || "/images/placeholder.jpg"}
        alt={accommodation?.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>{accommodation.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{accommodation.destination}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={accommodation.roomType} size="small" variant="outlined" />
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">₹{accommodation.basePrice?.toLocaleString()}/night</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={`/accommodations/${accommodation._id}`} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  );
};

export default AccommodationCard;
