// src/components/common/StandardCardSkeleton.js
import React from 'react';
import { Skeleton, Box } from '@mui/material';

const StandardCardSkeleton = () => (
  <Box sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
    <Skeleton variant="rectangular" sx={{ height: { xs: 190, sm: 205 }, aspectRatio: '4 / 3' }} />
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Skeleton width="55%" height={22} />
      <Skeleton height={58} sx={{ mt: 0.5 }} />
      <Skeleton width="70%" height={28} sx={{ mt: 1 }} />
      <Skeleton width="45%" height={32} sx={{ mt: 1.5 }} />
      <Skeleton variant="rounded" height={44} sx={{ mt: 1.5 }} />
    </Box>
  </Box>
);

export default StandardCardSkeleton;