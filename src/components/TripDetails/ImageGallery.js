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
      <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'neutral.100' }}>
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
    <Stack spacing={2}>
      <Paper sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }} elevation={3}>
        <Box sx={{ paddingTop: '56.25%', position: 'relative' }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
              sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
            >
              <ArrowBackIosNew />
            </IconButton>
            <IconButton
              onClick={() => handleNavigation('next')}
              sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
            >
              <ArrowForwardIos />
            </IconButton>
          </>
        )}
      </Paper>

      {images.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {images.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img}
              onClick={() => setCurrentIndex(index)}
              sx={{
                height: isMobile ? 60 : 80,
                width: isMobile ? 80 : 120,
                objectFit: 'cover',
                borderRadius: 1,
                cursor: 'pointer',
                border: index === currentIndex ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                opacity: index === currentIndex ? 1 : 0.6,
                transition: 'opacity 0.2s, border 0.2s',
                '&:hover': {
                  opacity: 1,
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
