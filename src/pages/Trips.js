// src/pages/Trips.js — user-facing trip listing: search, filters, sorting and booking.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { getAllTrips } from "../endpoints";
import { useNotification } from "../context/NotificationContext";
import { TripListSkeleton } from "../components/common/TripCardSkeleton";
import TripsHeader from "../components/trips/TripsHeader";
import TripFilters, { DEFAULT_FILTER_STATE } from "../components/trips/TripFilters";
import TripCard from "../components/trips/TripCard";
import BookNowDialog from "../components/trips/BookNowDialog";
import { TripsEmptyState, TripsErrorState } from "../components/trips/TripsStates";

const FILTER_OPTION_KEYS = ["destinations", "themes", "inclusions", "exclusions"];

const EMPTY_FILTER_OPTIONS = {
  destinations: [],
  themes: [],
  inclusions: [],
  exclusions: [],
};

const Trips = () => {
  const location = useLocation();
  const { notify } = useNotification();
  const preSearchTerm = location.state?.search;

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState(preSearchTerm || "");
  const [filterState, setFilterState] = useState(DEFAULT_FILTER_STATE);
  const [filterOptions, setFilterOptions] = useState(EMPTY_FILTER_OPTIONS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Keep search in sync when arriving with a pre-filled term (e.g. from the home page).
  useEffect(() => {
    if (preSearchTerm) setSearchTerm(preSearchTerm);
  }, [preSearchTerm]);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(getAllTrips);
      if (!response.ok) throw new Error("Failed to fetch trips");
      const data = await response.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setTrips([]);
      setError(true);
      notify("We couldn't load trips. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Filter options are non-critical: if they fail, the dialog simply shows empty lists.
  useEffect(() => {
    let isActive = true;
    const fetchFilterOptions = async () => {
      try {
        const responses = await Promise.all(
          FILTER_OPTION_KEYS.map((key) => fetch(`${getAllTrips}/filters/${key}`))
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

  const filteredTrips = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const {
      sortBy,
      priceRange: [minPrice, maxPrice],
      selectedDestinations,
      selectedThemes,
      selectedInclusions,
      selectedExclusions,
    } = filterState;

    const result = trips.filter((trip) => {
      if (term && !trip.name?.toLowerCase().includes(term)) return false;
      const price = Number(trip.price);
      if (!(price >= minPrice && price <= maxPrice)) return false;
      if (selectedDestinations.length > 0 && !selectedDestinations.includes(trip.destination)) {
        return false;
      }
      if (
        selectedThemes.length > 0 &&
        !selectedThemes.some((theme) => (trip.themes || []).includes(theme))
      ) {
        return false;
      }
      if (
        selectedInclusions.length > 0 &&
        !selectedInclusions.every((inclusion) => (trip.inclusions || []).includes(inclusion))
      ) {
        return false;
      }
      if (
        selectedExclusions.length > 0 &&
        !selectedExclusions.every((exclusion) => (trip.exclusions || []).includes(exclusion))
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
  }, [trips, searchTerm, filterState]);

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
      <TripsHeader
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
          {filteredTrips.length} {filteredTrips.length === 1 ? "trip" : "trips"} found
        </Typography>
      )}

      {loading ? (
        <Box sx={{ pt: 3 }}>
          <TripListSkeleton count={6} />
        </Box>
      ) : error ? (
        <TripsErrorState onRetry={fetchTrips} />
      ) : filteredTrips.length > 0 ? (
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
          {filteredTrips.map((trip) => (
            <Grid item key={trip._id} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <TripCard trip={trip} onBook={setSelectedTrip} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <TripsEmptyState onClearFilters={handleClearFilters} />
      )}

      <TripFilters
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterState={filterState}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />

      <BookNowDialog trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
    </Box>
  );
};

export default Trips;
