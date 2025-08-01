// src/components/common/TripCardSkeleton.js
import React from 'react';
import { Card, CardContent, Skeleton, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TripCardSkeleton = () => {
  const theme = useTheme();
  const skeletonColor = theme.palette.secondary.light; // Or a lighter shade like alpha(theme.palette.secondary.main, 0.1)

  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px', // Consistent with theme card styles
        overflow: 'hidden',
        bgcolor: theme.palette.background.paper,
        // Using a very light tint of secondary color for the skeleton background
        // to subtly hint at the brand color for loaders.
        // Adjust alpha for desired intensity.
        // Alternatively, style individual Skeleton components if more control is needed.
        // For a more standard look, remove this bgcolor or set to a light grey.
        // boxShadow: theme.shadows[1] // Optional: if skeletons should have shadow
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          paddingTop: { xs: '50%', sm: '56.25%' }, // Maintain aspect ratio
          backgroundColor: skeletonColor
        }}
      />

      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {/* Text Skeletons */}
        <Skeleton variant="text" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, width: '80%', backgroundColor: skeletonColor }} />
        <Skeleton variant="text" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, width: '60%', backgroundColor: skeletonColor }} />

        {/* Price Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, mb: { xs: 0.5, sm: 1 } }}>
          <Skeleton variant="text" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, width: '40px', backgroundColor: skeletonColor }} />
          <Skeleton variant="text" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, width: '60px', backgroundColor: skeletonColor }} />
        </Box>

        {/* Button Skeletons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: '8px', backgroundColor: skeletonColor }} />
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: '6px', backgroundColor: skeletonColor }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Helper component to render multiple skeletons in a grid for the Trips page
export const TripListSkeleton = ({ count = 6 }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
          <TripCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

export default TripCardSkeleton;
