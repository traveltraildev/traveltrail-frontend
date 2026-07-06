// src/components/trips/TripsStates.js — empty and error states for the Trips listing.
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

const StateWrapper = ({ children }) => (
  <Box
    role="status"
    sx={{
      textAlign: "center",
      py: { xs: 6, md: 10 },
      px: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    {children}
  </Box>
);

export const TripsEmptyState = ({ onClearFilters }) => (
  <StateWrapper>
    <SearchOffIcon sx={{ fontSize: 64, color: "accent.main" }} aria-hidden="true" />
    <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
      No trips match your search
    </Typography>
    <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 440 }}>
      Try a different search term or remove some filters to see more adventures.
    </Typography>
    <Button variant="outlined" color="primary" onClick={onClearFilters}>
      Clear filters
    </Button>
  </StateWrapper>
);

export const TripsErrorState = ({ onRetry }) => (
  <StateWrapper>
    <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} aria-hidden="true" />
    <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
      We couldn't load trips
    </Typography>
    <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 440 }}>
      Something went wrong while fetching trips. Please check your connection and try again.
    </Typography>
    <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={onRetry}>
      Try again
    </Button>
  </StateWrapper>
);
