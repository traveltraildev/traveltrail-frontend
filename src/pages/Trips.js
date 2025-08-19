import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  useMediaQuery,
  Drawer,
  IconButton,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  CardContent,
  Link as RouterLink
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAllTrips } from "../endpoints";
import { useTheme } from "@mui/material/styles";
import { Tune, ExpandMore, Search } from "@mui/icons-material";
import { TripListSkeleton } from "../components/common/TripCardSkeleton";

// Reusable Trip Card (matches the one from Home.js for consistency)
const TripCard = ({ trip }) => (
  <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
    <CardMedia
      component="img"
      height="200"
      image={trip?.images[0] || "/images/placeholder.jpg"}
      alt={trip?.name}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" component="h3" fontWeight="600" noWrap>{trip.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{trip.destination}</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
        {trip.themes?.slice(0, 2).map(theme => <Chip key={theme} label={theme} size="small" />)}
      </Stack>
      <Typography variant="h5" fontWeight="700" color="primary">₹{trip.price?.toLocaleString()}</Typography>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Button component={RouterLink} to={`/trips/${trip._id}`} variant="contained" fullWidth>View Details</Button>
    </Box>
  </Paper>
);

// Filter Sidebar Component
const FilterSidebar = ({ filters, setFilters, options }) => {
  const handlePriceChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, priceRange: newValue }));
  };

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value],
    }));
  };

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Price Range</Typography></AccordionSummary>
        <AccordionDetails>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={50000}
            step={1000}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Destinations</Typography></AccordionSummary>
        <AccordionDetails>
          <Stack>
            {options.destinations.map(dest => (
              <FormControlLabel key={dest} control={<Checkbox checked={filters.selectedDestinations.includes(dest)} onChange={() => handleCheckboxChange('selectedDestinations', dest)} />} label={dest} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Themes</Typography></AccordionSummary>
        <AccordionDetails>
          <Stack>
            {options.themes.map(theme => (
              <FormControlLabel key={theme} control={<Checkbox checked={filters.selectedThemes.includes(theme)} onChange={() => handleCheckboxChange('selectedThemes', theme)} />} label={theme} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

const TripsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ destinations: [], themes: [] });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: location.state?.search || '',
    priceRange: [0, 50000],
    selectedDestinations: [],
    selectedThemes: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tripsRes, destinationsRes, themesRes] = await Promise.all([
          fetch(getAllTrips),
          fetch(`${getAllTrips}/filters/destinations`),
          fetch(`${getAllTrips}/filters/themes`),
        ]);
        const tripsData = await tripsRes.json();
        const destinationsData = await destinationsRes.json();
        const themesData = await themesRes.json();
        setTrips(tripsData);
        setFilterOptions({ destinations: destinationsData, themes: themesData });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const searchMatch = trip.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || trip.destination.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const priceMatch = trip.price >= filters.priceRange[0] && trip.price <= filters.priceRange[1];
      const destinationMatch = filters.selectedDestinations.length === 0 || filters.selectedDestinations.includes(trip.destination);
      const themeMatch = filters.selectedThemes.length === 0 || filters.selectedThemes.some(theme => trip.themes?.includes(theme));
      return searchMatch && priceMatch && destinationMatch && themeMatch;
    });
  }, [trips, filters]);

  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Typography variant="h2" component="h1" fontWeight="700" sx={{ textAlign: 'center', mb: 4 }}>
        Find Your Next Adventure
      </Typography>
      
      <Grid container spacing={4}>
        {/* Filter Sidebar (Desktop) */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
              <FilterSidebar filters={filters} setFilters={setFilters} options={filterOptions} />
            </Paper>
          </Grid>
        )}

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            {/* Search and Mobile Filter Button */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by trip name or destination..."
                value={filters.searchTerm}
                onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              {isMobile && (
                <IconButton onClick={() => setMobileFiltersOpen(true)}>
                  <Tune />
                </IconButton>
              )}
            </Box>

            {/* Results Grid */}
            {loading ? (
              <TripListSkeleton count={9} />
            ) : (
              <Grid container spacing={3}>
                {filteredTrips.length > 0 ? (
                  filteredTrips.map(trip => (
                    <Grid item key={trip._id} xs={12} sm={6} lg={4}>
                      <TripCard trip={trip} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6">No trips found</Typography>
                    <Typography color="text.secondary">Try adjusting your filters.</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer anchor="left" open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
          <FilterSidebar filters={filters} setFilters={setFilters} options={filterOptions} />
          <Button fullWidth variant="contained" onClick={() => setMobileFiltersOpen(false)} sx={{ mt: 2 }}>Apply</Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default TripsPage;