import React, { useState, useEffect } from "react";
import { Box, IconButton, useTheme, LinearProgress, Typography, useMediaQuery } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, CheckCircle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { alpha } from '@mui/material/styles';

const ImageGallery = ({ images }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleNavigation('prev');
      if (e.key === 'ArrowRight') handleNavigation('next');
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleNavigation = (direction) => {
    setProgress(0);
    setCurrentIndex(prev => 
      direction === 'next' 
        ? (prev + 1) % images.length 
        : (prev - 1 + images.length) % images.length
    );
  };

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(() => {
      setProgress(old => (old >= 100 ? (setCurrentIndex(p => (p + 1) % images.length), 0) : old + 1));
    }, 50);
    return () => clearInterval(timer);
  }, [autoPlay, images.length]);

  const handleThumbnailClick = (index) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  // Empty state
  if (!images?.length) return (
    <Box sx={{ 
      height: 400, 
      bgcolor: 'background.paper', 
      borderRadius: 4, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      mt: { xs: '56px', sm: '64px' } 
    }}>
      <Typography variant="h6" color="text.secondary">
        No images available
      </Typography>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        position: 'relative',
        mt: { xs: '37px', sm: '32px' }, // Spacing for sticky header
        '&:hover .gallery-controls': { opacity: 1 }
      }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
      onFocus={() => setAutoPlay(false)}
      onBlur={() => setAutoPlay(true)}
    >
      {/* Main Image Container */}
      <Box sx={{
        position: 'relative',
        borderRadius: { xs: 0, sm: 4 },
        overflow: 'hidden',
        bgcolor: 'background.paper',
        aspectRatio: '16/9',
        boxShadow: theme.shadows[2]
      }}>
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery item ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
          />
        </AnimatePresence>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={() => handleNavigation('prev')}
              aria-label="Previous image"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                p: 1,
                '&:hover': { bgcolor: 'background.paper' },
                opacity: isMobile ? 1 : 0,
                transition: 'opacity 0.2s ease'
              }}
            >
              <ArrowBackIos fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => handleNavigation('next')}
              aria-label="Next image"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                p: 1,
                '&:hover': { bgcolor: 'background.paper' },
                opacity: isMobile ? 1 : 0,
                transition: 'opacity 0.2s ease'
              }}
            >
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </>
        )}

        {/* Progress & Counter */}
        {images.length > 1 && (
          <>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.primary.main
                }
              }}
            />

            <Typography 
              variant="caption" 
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                px: 1.2,
                py: 0.4,
                borderRadius: 1.5,
                color: 'text.primary',
                fontSize: '0.75rem',
                fontWeight: 500,
                backdropFilter: 'blur(4px)'
              }}
            >
              {currentIndex + 1}/{images.length}
            </Typography>
          </>
        )}
      </Box>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <Box 
          component="nav"
          aria-label="Image thumbnails"
          sx={{
            display: 'flex',
            gap: 1.5,
            mt: 2,
            px: 2,
            pb: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'text.secondary',
              borderRadius: 2
            }
          }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              component="button"
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => e.key === 'Enter' && handleThumbnailClick(index)}
              tabIndex={0}
              aria-label={`View image ${index + 1}`}
              sx={{
                position: 'relative',
                flexShrink: 0,
                cursor: 'pointer',
                borderRadius: 1.5,
                overflow: 'hidden',
                border: `2px solid ${index === currentIndex 
                  ? theme.palette.primary.main 
                  : alpha(theme.palette.text.primary, 0.1)}`,
                opacity: index === currentIndex ? 1 : 0.8,
                transition: 'all 0.2s ease',
                '&:hover': {
                  opacity: 1,
                  transform: 'translateY(-2px)'
                },
                aspectRatio: '16/9',
                width: { xs: 80, sm: 100 },
                p: 0,
                bgcolor: 'transparent',
                outline: 'none'
              }}
            >
              <img
                src={img}
                alt=""
                role="presentation"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none'
                }}
              />
              
              {index === currentIndex && (
                <CheckCircle sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  color: 'primary.main',
                  fontSize: 16,
                  bgcolor: alpha(theme.palette.background.paper, 0.9),
                  borderRadius: '50%',
                  p: 0.2
                }} />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageGallery;