// src/components/accommodations/AccommodationCardSkeleton.js — loading placeholders
// matching the AccommodationCard layout.
import React from "react";
import { Box, Card, CardContent, Grid, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";

const skeletonSx = (theme) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.18),
});

const AccommodationCardSkeleton = () => (
  <Card
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: 1,
      bgcolor: "background.paper",
    }}
  >
    {/* Image placeholder (16:9) */}
    <Skeleton variant="rectangular" width="100%" sx={(theme) => ({ pt: "56.25%", ...skeletonSx(theme) })} />

    <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      <Skeleton variant="text" sx={(theme) => ({ fontSize: "1rem", width: "80%", ...skeletonSx(theme) })} />
      <Skeleton variant="text" sx={(theme) => ({ fontSize: "0.875rem", width: "55%", ...skeletonSx(theme) })} />

      {/* Feature chips */}
      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
        <Skeleton variant="rounded" width={90} height={24} sx={skeletonSx} />
        <Skeleton variant="rounded" width={90} height={24} sx={skeletonSx} />
      </Box>

      {/* CTA */}
      <Skeleton variant="rectangular" width="100%" height={36} sx={(theme) => ({ borderRadius: "8px", mt: "auto", ...skeletonSx(theme) })} />
    </CardContent>
  </Card>
);

// Grid of skeleton cards shown while accommodations load.
export const AccommodationListSkeleton = ({ count = 6 }) => (
  <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center" aria-hidden="true">
    {Array.from(new Array(count)).map((_, index) => (
      <Grid item key={index} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
        <AccommodationCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export default AccommodationCardSkeleton;
