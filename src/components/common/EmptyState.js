import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, message, buttonText, buttonLink }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <img src="/images/empty-state.svg" alt="Empty state" style={{ width: '100%', maxWidth: 300, marginBottom: 24 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{message}</Typography>
      {buttonText && buttonLink && (
        <Button component={Link} to={buttonLink} variant="contained">
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
