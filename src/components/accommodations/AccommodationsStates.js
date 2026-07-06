// src/components/accommodations/AccommodationsStates.js — empty and error states
// for the Accommodations listing.
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

export const AccommodationsEmptyState = ({ hasActiveFilters, onClearFilters }) => (
  <StateWrapper>
    <SearchOffIcon sx={{ fontSize: 64, color: "accent.main" }} aria-hidden="true" />
    <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
      {hasActiveFilters ? "No accommodations match your search" : "No accommodations found"}
    </Typography>
    <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 440 }}>
      {hasActiveFilters
        ? "Try a different search term or remove some filters to see more stays."
        : "Check back soon — new stays are added regularly."}
    </Typography>
    {hasActiveFilters && (
      <Button variant="outlined" color="primary" onClick={onClearFilters}>
        Clear filters
      </Button>
    )}
  </StateWrapper>
);

export const AccommodationsErrorState = ({ onRetry }) => (
  <StateWrapper>
    <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} aria-hidden="true" />
    <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
      We couldn't load accommodations
    </Typography>
    <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 440 }}>
      Something went wrong while fetching stays. Please check your connection and try again.
    </Typography>
    <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={onRetry}>
      Try again
    </Button>
  </StateWrapper>
);
