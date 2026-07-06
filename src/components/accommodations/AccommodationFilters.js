// src/components/accommodations/AccommodationFilters.js — filter dialog for the
// Accommodations listing. Filters apply live via onFilterChange; "Show Results"
// simply closes the dialog.
import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// A priceRange max of MAX_PRICE means "no upper limit" (slider shows "₹10000+").
export const MAX_PRICE = 1000000;
export const SLIDER_MAX = 10000;

export const DEFAULT_FILTER_STATE = {
  sortBy: "name",
  priceRange: [0, MAX_PRICE],
  selectedDestinations: [],
  selectedThemes: [],
  selectedAmenities: [],
};

const FILTER_CATEGORIES = [
  { id: "sort", label: "Sort" },
  { id: "price", label: "Price" },
  { id: "destinations", label: "Destinations", field: "selectedDestinations" },
  { id: "themes", label: "Themes", field: "selectedThemes" },
  { id: "amenities", label: "Amenities", field: "selectedAmenities" },
];

const PRICE_MARKS = [0, 2000, 4000, 6000, 8000].map((value) => ({
  value,
  label: `₹${value}`,
}));
PRICE_MARKS.push({ value: SLIDER_MAX, label: `₹${SLIDER_MAX}+` });

const CheckboxGroup = ({ options, selected, onToggle, emptyLabel }) => {
  if (!options.length) {
    return (
      <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
        {emptyLabel}
      </Typography>
    );
  }
  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
      {options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={selected.includes(option)}
              onChange={(event) => onToggle(option, event.target.checked)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );
};

const AccommodationFilters = ({ open, onClose, filterState, filterOptions, onFilterChange }) => {
  const [activeCategory, setActiveCategory] = useState("sort");

  const toggleListValue = (field) => (value, checked) => {
    const current = filterState[field];
    onFilterChange({
      [field]: checked ? [...current, value] : current.filter((item) => item !== value),
    });
  };

  const renderPanel = () => {
    if (activeCategory === "sort") {
      return (
        <Box sx={{ mt: 3 }}>
          <RadioGroup
            value={filterState.sortBy}
            onChange={(event) => onFilterChange({ sortBy: event.target.value })}
            aria-label="Sort accommodations"
            row
          >
            <FormControlLabel value="name" control={<Radio />} label="Alphabetical (A-Z)" />
            <FormControlLabel value="price-low" control={<Radio />} label="Price: Low to High" />
            <FormControlLabel value="price-high" control={<Radio />} label="Price: High to Low" />
          </RadioGroup>
        </Box>
      );
    }

    if (activeCategory === "price") {
      const sliderValue = [
        filterState.priceRange[0],
        Math.min(filterState.priceRange[1], SLIDER_MAX),
      ];
      return (
        <Box sx={{ mt: 3, px: 2 }}>
          <Slider
            value={sliderValue}
            onChange={(event, newValue) =>
              onFilterChange({
                priceRange: [
                  newValue[0],
                  newValue[1] >= SLIDER_MAX ? MAX_PRICE : newValue[1],
                ],
              })
            }
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => (value >= SLIDER_MAX ? `₹${SLIDER_MAX}+` : `₹${value}`)}
            getAriaLabel={(index) => (index === 0 ? "Minimum price per night" : "Maximum price per night")}
            min={0}
            max={SLIDER_MAX}
            step={500}
            marks={PRICE_MARKS}
            sx={{ width: "100%" }}
          />
        </Box>
      );
    }

    const category = FILTER_CATEGORIES.find((item) => item.id === activeCategory);
    if (!category?.field) return null;
    return (
      <CheckboxGroup
        options={filterOptions[category.id] || []}
        selected={filterState[category.field]}
        onToggle={toggleListValue(category.field)}
        emptyLabel={`No ${category.label.toLowerCase()} available yet.`}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Fade}
      aria-labelledby="accommodation-filters-title"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: 12,
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
          py: 2,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          id="accommodation-filters-title"
          variant="h6"
          component="span"
          sx={{ fontWeight: 600 }}
        >
          Filter Options
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close filter options"
          sx={{ color: "secondary.contrastText" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <List sx={{ "& .MuiListItemButton-root": { borderRadius: 2 } }}>
              {FILTER_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <ListItem key={category.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => setActiveCategory(category.id)}
                      sx={{
                        bgcolor: isActive ? "secondary.light" : "transparent",
                        borderLeft: "4px solid",
                        borderLeftColor: isActive ? "secondary.main" : "transparent",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <ListItemText
                        primary={category.label}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: isActive ? "secondary.dark" : "text.primary",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box
              sx={{
                maxHeight: "60vh",
                overflowY: "auto",
                pr: 2,
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "text.secondary",
                  borderRadius: "4px",
                },
              }}
            >
              {renderPanel()}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": { borderColor: "text.secondary" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          sx={{ px: 4, fontWeight: 600 }}
        >
          Show Results
        </Button>
      </Box>
    </Dialog>
  );
};

export default AccommodationFilters;
