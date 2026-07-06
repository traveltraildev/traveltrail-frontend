// src/components/accommodations/AccommodationsHeader.js — sticky header for the
// Accommodations page: page title, live search field and the active-filter chip row.
import React from "react";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TuneIcon from "@mui/icons-material/Tune";
import { DEFAULT_FILTER_STATE, MAX_PRICE } from "./AccommodationFilters";

const SORT_LABELS = {
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
};

const LIST_FILTER_FIELDS = ["selectedDestinations", "selectedThemes", "selectedAmenities"];

// Flatten the filter state into removable chips.
const buildActiveChips = (filterState, onFilterChange) => {
  const chips = [];

  if (filterState.sortBy !== DEFAULT_FILTER_STATE.sortBy) {
    chips.push({
      key: "sort",
      label: `Sort: ${SORT_LABELS[filterState.sortBy] || filterState.sortBy}`,
      onDelete: () => onFilterChange({ sortBy: DEFAULT_FILTER_STATE.sortBy }),
    });
  }

  const [minPrice, maxPrice] = filterState.priceRange;
  if (minPrice !== 0 || maxPrice !== MAX_PRICE) {
    chips.push({
      key: "price",
      label:
        maxPrice >= MAX_PRICE
          ? `₹${minPrice.toLocaleString("en-IN")}+`
          : `₹${minPrice.toLocaleString("en-IN")} – ₹${maxPrice.toLocaleString("en-IN")}`,
      onDelete: () => onFilterChange({ priceRange: [0, MAX_PRICE] }),
    });
  }

  LIST_FILTER_FIELDS.forEach((field) => {
    filterState[field].forEach((value) => {
      chips.push({
        key: `${field}-${value}`,
        label: value,
        onDelete: () =>
          onFilterChange({ [field]: filterState[field].filter((item) => item !== value) }),
      });
    });
  });

  return chips;
};

const activeChipSx = {
  bgcolor: "secondary.light",
  color: "text.primary",
  flexShrink: 0,
  "& .MuiChip-deleteIcon": {
    color: "secondary.dark",
    "&:hover": { color: "text.primary" },
  },
};

const AccommodationsHeader = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  onOpenFilters,
  filterState,
  onFilterChange,
}) => {
  const activeChips = buildActiveChips(filterState, onFilterChange);

  return (
    <Box
      component="header"
      sx={(theme) => ({
        pt: { xs: 2, md: 3 },
        textAlign: "center",
        position: "sticky",
        top: "68px", // sits just below the fixed navbar
        zIndex: theme.zIndex.appBar - 1,
        backdropFilter: "blur(10px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={(theme) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          fontSize: { xs: "1.75rem", md: "2.5rem" },
          px: 2,
          mb: { xs: 2, md: 3 },
        })}
      >
        Explore Stays
      </Typography>

      {/* Search (filters live as you type) */}
      <Box sx={{ maxWidth: 800, mx: "auto", mb: { xs: 1.5, md: 2 }, px: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search accommodations..."
          value={searchTerm}
          onChange={onSearchChange}
          inputProps={{ "aria-label": "Search accommodations by name" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton onClick={onClearSearch} aria-label="Clear search" size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              borderRadius: "8px",
              bgcolor: "background.default",
              boxShadow: 2,
              height: { xs: "48px", md: "56px" },
            },
          }}
        />
      </Box>

      {/* Filter chips */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "flex-start",
          flexWrap: "nowrap",
          overflowX: "auto",
          px: 2,
          pb: 1.5,
          "&::-webkit-scrollbar": { height: "3px", backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "text.secondary",
            borderRadius: 2,
          },
        }}
      >
        <Chip
          label={activeChips.length > 0 ? `Filters (${activeChips.length})` : "Filters"}
          onClick={onOpenFilters}
          icon={<TuneIcon fontSize="small" />}
          variant="outlined"
          aria-label="Open filter options"
          sx={(theme) => ({
            borderColor: "divider",
            bgcolor: "background.paper",
            flexShrink: 0,
            fontWeight: 600,
            "&:hover": { bgcolor: alpha(theme.palette.secondary.main, 0.1) },
          })}
        />
        {activeChips.map((chip) => (
          <Chip key={chip.key} label={chip.label} onDelete={chip.onDelete} sx={activeChipSx} />
        ))}
      </Box>
    </Box>
  );
};

export default AccommodationsHeader;
