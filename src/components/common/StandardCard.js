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
    e.preventDefault();
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
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
        }
      }}>
        {children}
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        width: '100%',
        maxWidth: 360,
        minHeight: 420,
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        '&:hover': { 
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          '& .card-media': {
            transform: 'scale(1.05)'
          }
        },
        position: 'relative'
      }}
    >
      {/* Image Container with Gradient Overlay */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          className="card-media"
          component="img"
          height="240"
          image={imageUrl || "/images/placeholder.jpg"}
          alt={title}
          sx={{
            transition: 'transform 0.8s ease',
            objectFit: 'cover',
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3))',
          }}
        />
        
        {/* Price Badge */}
        <Box 
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 2,
            px: 2,
            py: 1,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h6" fontWeight="800" color="primary">
            {price}
          </Typography>
        </Box>

        {/* Wishlist Button */}
        {showWishlistButton && (
          <IconButton
            aria-label="add to wishlist"
            onClick={handleWishlistClick}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              width: 40,
              height: 40,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              },
            }}
          >
            {isWishlisted(item._id) ? (
              <FavoriteIcon color="error" sx={{ fontSize: 20 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            )}
          </IconButton>
        )}
      </Box>

      {/* Content Area */}
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2 
      }}>
        <Box>
          <Typography 
            variant="h6" 
            component="h3" 
            fontWeight="700" 
            gutterBottom
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Tags */}
        {tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {tags.slice(0, 3).map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="filled"
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.7rem',
                  height: 24,
                  borderRadius: 1.5,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              />
            ))}
            {tags.length > 3 && (
              <Chip 
                label={`+${tags.length - 3}`} 
                size="small" 
                variant="outlined"
                sx={{ height: 24, borderRadius: 1.5 }}
              />
            )}
          </Stack>
        )}
      </CardContent>

      {/* Action Area */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button 
          component={RouterLink} 
          to={linkTo} 
          variant="contained" 
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: '700',
            fontSize: '1rem',
            textTransform: 'none',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            }
          }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default StandardCard;
