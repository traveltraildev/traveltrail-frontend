import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Stack, Box, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth, useClerk } from '@clerk/clerk-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StandardCard = ({
  item,
  itemType, // 'Trip' or 'Accommodation'
  title,
  subtitle,
  imageUrl,
  tags = [],
  price,
  linkTo,
  showWishlistButton = true,
  children, // For custom content, like in "Why Choose Us"
  variant = 'default', // 'default' or 'custom'
}) => {
  const theme = useTheme();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { addItem, removeItem, isWishlisted } = useWishlist();

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (isWishlisted(item._id)) {
      removeItem(item._id);
    } else {
      addItem(item._id, itemType);
    }
  };

  if (variant === 'custom') {
    return (
      <Card sx={{
        p: 4,
        borderRadius: 4,
        textAlign: 'center',
        height: '100%',
        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #ffffff 60%, #f9f5f3 100%)',
        position: 'relative',
        transition: 'all 0.35s ease',
        '&:hover': {
          boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #f9f5f3 60%, #ffffff 100%)'
        }
      }}>
        {children}
      </Card>
    );
  }

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: theme.shape.borderRadius, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] }, boxShadow: theme.shadows[3], position: 'relative' }}>
      {showWishlistButton && (
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
            zIndex: 1
          }}
        >
          {isWishlisted(item._id) ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
      <CardMedia
        component="img"
        height="220"
        image={imageUrl || "/images/placeholder.jpg"}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{subtitle}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">{price}</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={linkTo} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  );
};

export default StandardCard;