import React, { useState } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Paper sx={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'neutral.100', borderRadius: 3 }}>
        <Typography>No images available.</Typography>
      </Paper>
    );
  }

  const handleNavigation = (direction) => {
    setCurrentIndex(prev => {
      const newIndex = direction === 'next' ? prev + 1 : prev - 1;
      return (newIndex + images.length) % images.length;
    });
  };

  return (
    <Stack spacing={1.5}>
      <Paper sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3 }} elevation={0}>
        <Box sx={{ paddingTop: '60%', position: 'relative' }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AnimatePresence>
        </Box>

        {images.length > 1 && (
          <>
            <IconButton
              onClick={() => handleNavigation('prev')}
              size="small"
              sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
              <ArrowBackIosNew sx={{fontSize: '1rem'}} />
            </IconButton>
            <IconButton
              onClick={() => handleNavigation('next')}
              size="small"
              sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
            >
              <ArrowForwardIos sx={{fontSize: '1rem'}}/>
            </IconButton>
          </>
        )}
      </Paper>

      {images.length > 1 && (
        <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
          {images.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img}
              onClick={() => setCurrentIndex(index)}
              sx={{
                height: isMobile ? 65 : 85,
                width: isMobile ? 90 : 120,
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
                border: index === currentIndex ? `3px solid ${theme.palette.primary.main}` : `3px solid transparent`,
                filter: index === currentIndex ? 'none' : 'brightness(0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'none',
                  transform: 'scale(1.05)'
                },
              }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default ImageGallery;