// src/components/common/StandardCardSkeleton.js
import React from 'react';
import { Skeleton, Box } from '@mui/material';

const StandardCardSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
    <Box sx={{ pt: 1.5 }}>
      <Skeleton height={30} />
      <Skeleton width="60%" sx={{ mt: 1 }} />
    </Box>
  </Box>
);

export default StandardCardSkeleton;