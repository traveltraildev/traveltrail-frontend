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
  Card,
  CardMedia,
  CardContent,
  InputAdornment,
  MenuItem
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAllTrips } from "../endpoints";
import { useTheme } from "@mui/material/styles";
import { Tune, ExpandMore, Search } from "@mui/icons-material";
import TripCardSkeleton from "../components/common/TripCardSkeleton"; // Corrected import
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const TripCard = ({ trip }) => {
  const theme = useTheme();
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] } }}>
      <CardMedia
        component="img"
        height="220"
        image={trip?.images[0] || "/images/placeholder.jpg"}
        alt={trip?.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" fontWeight="600" noWrap>{trip.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{trip.destination}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
          {trip.themes?.slice(0, 2).map(theme => <Chip key={theme} label={theme} size="small" variant="outlined" />)}
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">₹{trip.price?.toLocaleString()}</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={Link} to={`/trips/${trip._id}`} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  );
};

const FilterSidebar = ({
  initialFilters,
  onApply,
  onReset,
  options,
  sortBy,
  onSortChange,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handlePriceChange = (event, newValue) => {
    setLocalFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  const handleCheckboxChange = (category, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleReset = () => {
    const resetFilters = {
      ...initialFilters,
      priceRange: [0, 100000],
      selectedDestinations: [],
      selectedThemes: [],
      selectedInclusions: [],
      selectedExclusions: [],
    };
    setLocalFilters(resetFilters);
    onReset(resetFilters);
  };

  return (
    <Stack spacing={2} sx={{ p: 2.5 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            select
            value={sortBy}
            onChange={onSortChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="recommended">Recommended</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="name_asc">Name: A to Z</MenuItem>
            <MenuItem value="name_desc">Name: Z to A</MenuItem>
          </TextField>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={localFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={5000}
            sx={{ ml: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
            <Typography variant="body2">₹{localFilters.priceRange[0]}</Typography>
            <Typography variant="body2">₹{localFilters.priceRange[1]}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">Destinations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ maxHeight: 200, overflowY: "auto" }}>
            {options.destinations.map((dest) => (
              <FormControlLabel
                key={dest}
                control={
                  <Checkbox
                    checked={localFilters.selectedDestinations.includes(dest)}
                    onChange={() =>
                      handleCheckboxChange("selectedDestinations", dest)
                    }
                  />
                }
                label={dest}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">Themes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ maxHeight: 200, overflowY: "auto" }}>
            {options.themes.map((theme) => (
              <FormControlLabel
                key={theme}
                control={
                  <Checkbox
                    checked={localFilters.selectedThemes.includes(theme)}
                    onChange={() => handleCheckboxChange("selectedThemes", theme)}
                  />
                }
                label={theme}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">Inclusions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ maxHeight: 200, overflowY: "auto" }}>
            {options.inclusions.map((inclusion) => (
              <FormControlLabel
                key={inclusion}
                control={
                  <Checkbox
                    checked={localFilters.selectedInclusions.includes(inclusion)}
                    onChange={() => handleCheckboxChange("selectedInclusions", inclusion)}
                  />
                }
                label={inclusion}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="600">Exclusions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ maxHeight: 200, overflowY: "auto" }}>
            {options.exclusions.map((exclusion) => (
              <FormControlLabel
                key={exclusion}
                control={
                  <Checkbox
                    checked={localFilters.selectedExclusions.includes(exclusion)}
                    onChange={() => handleCheckboxChange("selectedExclusions", exclusion)}
                  />
                }
                label={exclusion}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Stack direction="row" spacing={2} sx={{ p: 2.5 }}>
        <Button variant="contained" onClick={() => onApply(localFilters)} fullWidth>
          Apply
        </Button>
        <Button variant="outlined" onClick={handleReset} fullWidth>
          Reset
        </Button>
      </Stack>
    </Stack>
  );
};


const TripsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ destinations: [], themes: [], inclusions: [], exclusions: [] });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const initialFilters = {
    searchTerm: location.state?.search || "",
    priceRange: [0, 100000],
    selectedDestinations: [],
    selectedThemes: [],
    selectedInclusions: [],
    selectedExclusions: [],
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tripsResponse, destResponse, themesResponse, inclusionsResponse, exclusionsResponse] = await Promise.all([
          fetch(getAllTrips),
          fetch(`${getAllTrips}/filters/destinations`),
          fetch(`${getAllTrips}/filters/themes`),
          fetch(`${getAllTrips}/filters/inclusions`),
          fetch(`${getAllTrips}/filters/exclusions`),
        ]);

        const tripsData = await tripsResponse.json();
        const destinations = await destResponse.json();
        const themes = await themesResponse.json();
        const inclusions = await inclusionsResponse.json();
        const exclusions = await exclusionsResponse.json();

        setTrips(tripsData);
        setFilterOptions({ 
          destinations: destinations || [], 
          themes: themes || [], 
          inclusions: inclusions || [], 
          exclusions: exclusions || [] 
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setMobileFiltersOpen(false);
  };

  const handleResetFilters = (resetFilters) => {
    setFilters(resetFilters);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredTrips = useMemo(() => {
    const filtered = trips.filter(trip => {
      const searchMatch = trip.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || trip.destination.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const priceMatch = trip.price >= filters.priceRange[0] && trip.price <= filters.priceRange[1];
      const destinationMatch = filters.selectedDestinations.length === 0 || filters.selectedDestinations.includes(trip.destination);
      const themeMatch = filters.selectedThemes.length === 0 || filters.selectedThemes.some(theme => trip.themes?.includes(theme));
      const inclusionMatch = filters.selectedInclusions.length === 0 || filters.selectedInclusions.some(inclusion => trip.inclusions?.includes(inclusion));
      const exclusionMatch = filters.selectedExclusions.length === 0 || filters.selectedExclusions.some(exclusion => trip.exclusions?.includes(exclusion));
      return searchMatch && priceMatch && destinationMatch && themeMatch && inclusionMatch && exclusionMatch;
    });

    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [trips, filters, sortBy]);

  return (
    <>
    <Navbar />
    <Container maxWidth="xl" sx={{ pt: 12, pb: 6 }}>
      <Typography variant="h2" component="h1" fontWeight="700" sx={{ textAlign: 'center', mb: 2 }}>
        Find Your Next Adventure
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: '600px', mx: 'auto' }}>
        Explore our curated list of trips. Use the filters to find the perfect journey that matches your style and budget.
      </Typography>
      
      <Grid container spacing={4}>
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={0} sx={{ p: 0, position: 'sticky', top: 100, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ p: 2.5, pb: 1, fontWeight: 600 }}>Filters</Typography>
              <FilterSidebar 
                initialFilters={filters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                options={filterOptions}
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by trip name or destination..."
                value={filters.searchTerm}
                onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>,
                  sx: { borderRadius: 2 }
                }}
              />
              {isMobile && (
                <IconButton onClick={() => setMobileFiltersOpen(true)} sx={{border: `1px solid ${theme.palette.divider}`}}>
                  <Tune />
                </IconButton>
              )}
            </Box>

            {loading ? (
              <Grid container spacing={3} sx={{ margin: 0, width: '100%' }}>
                {Array.from(new Array(9)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} lg={4} sx={{ padding: { xs: '8px', sm: '12px', md: '16px' } }}>
                    <TripCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3} sx={{ margin: 0, width: '100%' }}>
                {filteredTrips.length > 0 ? (
                  filteredTrips.map(trip => (
                    <Grid item key={trip._id} xs={12} sm={6} lg={4} sx={{ padding: { xs: '8px', sm: '12px', md: '16px' } }}>
                      <TripCard trip={trip} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5">No Trips Found</Typography>
                    <Typography color="text.secondary" sx={{mt: 1}}>Try adjusting your search or filters to find what you're looking for.</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Drawer anchor="left" open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} PaperProps={{sx: {width: 320}}}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Filters</Typography>
          <FilterSidebar 
            initialFilters={filters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            options={filterOptions}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            isMobile
          />
        </Box>
      </Drawer>
    </Container>
    <Footer />
    </>
  );
};

export default TripsPage;