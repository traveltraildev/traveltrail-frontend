import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Stack, Box, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth, useClerk } from '@clerk/clerk-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

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
  sx = {},
}) => {
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
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: '0 6px 20px rgba(33, 37, 41, 0.07)',
      position: 'relative',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(33, 37, 41, 0.13)',
      },
      ...sx,
    }}>
      {showWishlistButton && (
        <IconButton
          aria-label={isWishlisted(item._id) ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlistClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            boxShadow: 1,
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
        sx={{
          height: { xs: 190, sm: 205 },
          aspectRatio: '4 / 3',
          objectFit: 'cover',
          backgroundColor: 'grey.100',
        }}
        image={imageUrl || "/images/placeholder.jpg"}
        alt={title}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.75, color: 'text.secondary' }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" noWrap>{subtitle}</Typography>
        </Stack>
        <Typography
          variant="h6"
          component="h3"
          fontWeight="700"
          sx={{
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1.5, minHeight: 28 }}>
          {tags.filter(Boolean).map((tag, index) => (
            <Chip key={index} label={tag} size="small" sx={{ borderRadius: 1.5, bgcolor: 'grey.100' }} />
          ))}
        </Stack>
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography variant="h6" fontWeight="800" color="primary.main">{price}</Typography>
        </Box>
      </CardContent>
      <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 } }}>
        <Button component={RouterLink} to={linkTo} variant="contained" fullWidth sx={{ minHeight: 44 }}>
          View details
        </Button>
      </Box>
    </Card>
  );
};

export default StandardCard;