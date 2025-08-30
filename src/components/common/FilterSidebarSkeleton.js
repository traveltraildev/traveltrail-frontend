import React from 'react';
import { Stack, Accordion, AccordionSummary, AccordionDetails, Skeleton, Box } from '@mui/material';

const FilterSidebarSkeleton = () => {
  return (
    <Stack spacing={2} sx={{ p: 2.5 }}>
      {Array.from(new Array(4)).map((_, index) => (
        <Accordion key={index} defaultExpanded>
          <AccordionSummary>
            <Skeleton width="80%" height={24} />
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};

export default FilterSidebarSkeleton;