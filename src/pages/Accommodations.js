// src/pages/Accommodations.js — user-facing accommodations listing: search, filters and sorting.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getAllAccommodations } from "../endpoints";
import { useNotification } from "../context/NotificationContext";
import AccommodationsHeader from "../components/accommodations/AccommodationsHeader";
import AccommodationFilters, {
  DEFAULT_FILTER_STATE,
  MAX_PRICE,
} from "../components/accommodations/AccommodationFilters";
import AccommodationCard from "../components/accommodations/AccommodationCard";
import { AccommodationListSkeleton } from "../components/accommodations/AccommodationCardSkeleton";
import {
  AccommodationsEmptyState,
  AccommodationsErrorState,
} from "../components/accommodations/AccommodationsStates";

const FILTER_OPTION_KEYS = ["destinations", "themes", "amenities"];

const EMPTY_FILTER_OPTIONS = {
  destinations: [],
  themes: [],
  amenities: [],
};

const Accommodations = () => {
  const { notify } = useNotification();

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState(DEFAULT_FILTER_STATE);
  const [filterOptions, setFilterOptions] = useState(EMPTY_FILTER_OPTIONS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const fetchAccommodations = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(getAllAccommodations);
      if (!response.ok) throw new Error("Failed to fetch accommodations");
      const payload = await response.json();
      setAccommodations(Array.isArray(payload?.data) ? payload.data : []);
    } catch (fetchError) {
      setAccommodations([]);
      setError(true);
      notify("We couldn't load accommodations. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  // Filter options are non-critical: if they fail, the dialog simply shows empty lists.
  useEffect(() => {
    let isActive = true;
    const fetchFilterOptions = async () => {
      try {
        const responses = await Promise.all(
          FILTER_OPTION_KEYS.map((key) => fetch(`${getAllAccommodations}/filters/${key}`))
        );
        const values = await Promise.all(
          responses.map((response) => (response.ok ? response.json() : []))
        );
        if (isActive) {
          setFilterOptions(
            FILTER_OPTION_KEYS.reduce(
              (options, key, index) => ({ ...options, [key]: values[index] || [] }),
              {}
            )
          );
        }
      } catch (optionsError) {
        // Non-blocking: keep the default empty options.
      }
    };
    fetchFilterOptions();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredAccommodations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const {
      sortBy,
      priceRange: [minPrice, maxPrice],
      selectedDestinations,
      selectedThemes,
      selectedAmenities,
    } = filterState;

    const result = accommodations.filter((accommodation) => {
      if (term && !accommodation.name?.toLowerCase().includes(term)) return false;
      const price = Number(accommodation.price);
      if (!(price >= minPrice && price <= maxPrice)) return false;
      if (
        selectedDestinations.length > 0 &&
        !selectedDestinations.includes(accommodation.destination)
      ) {
        return false;
      }
      if (
        selectedThemes.length > 0 &&
        !selectedThemes.some((theme) => (accommodation.themes || []).includes(theme))
      ) {
        return false;
      }
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) => (accommodation.amenities || []).includes(amenity))
      ) {
        return false;
      }
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [accommodations, searchTerm, filterState]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    filterState.sortBy !== DEFAULT_FILTER_STATE.sortBy ||
    filterState.priceRange[0] !== 0 ||
    filterState.priceRange[1] !== MAX_PRICE ||
    filterState.selectedDestinations.length > 0 ||
    filterState.selectedThemes.length > 0 ||
    filterState.selectedAmenities.length > 0;

  const handleFilterChange = useCallback((changes) => {
    setFilterState((previous) => ({ ...previous, ...changes }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterState(DEFAULT_FILTER_STATE);
    setSearchTerm("");
  }, []);

  return (
    <Box
      sx={{
        pt: { xs: "84px", md: "96px" }, // clear the fixed 68px navbar
        pb: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <AccommodationsHeader
        searchTerm={searchTerm}
        onSearchChange={(event) => setSearchTerm(event.target.value)}
        onClearSearch={() => setSearchTerm("")}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        filterState={filterState}
        onFilterChange={handleFilterChange}
      />

      {!loading && !error && (
        <Typography
          variant="h6"
          component="p"
          aria-live="polite"
          sx={{ textAlign: "center", py: 3, color: "text.secondary", fontWeight: 600 }}
        >
          {filteredAccommodations.length}{" "}
          {filteredAccommodations.length === 1 ? "accommodation" : "accommodations"} found
        </Typography>
      )}

      {loading ? (
        <Box sx={{ pt: 3 }}>
          <AccommodationListSkeleton count={6} />
        </Box>
      ) : error ? (
        <AccommodationsErrorState onRetry={fetchAccommodations} />
      ) : filteredAccommodations.length > 0 ? (
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
          {filteredAccommodations.map((accommodation) => (
            <Grid item key={accommodation._id} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <AccommodationCard accommodation={accommodation} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <AccommodationsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      <AccommodationFilters
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterState={filterState}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
    </Box>
  );
};

export default Accommodations;
