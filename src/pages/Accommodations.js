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
  Skeleton
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAllAccommodations } from "../endpoints";
import { useTheme } from "@mui/material/styles";
import { Tune, ExpandMore, Search, KingBed, People } from "@mui/icons-material";

// Reusable Accommodation Card
const AccommodationCard = ({ accommodation }) => (
  <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
    <CardMedia
      component="img"
      height="200"
      image={accommodation?.images[0] || "/images/placeholder.jpg"}
      alt={accommodation?.name}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" component="h3" fontWeight="600" noWrap>{accommodation.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{accommodation.destination}</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
        <Chip icon={<KingBed />} label={accommodation.roomType} size="small" />
        <Chip icon={<People />} label={`${accommodation.maxOccupancy} Guests`} size="small" />
      </Stack>
      <Typography variant="h5" fontWeight="700" color="primary">₹{accommodation.price?.toLocaleString()}/night</Typography>
    </CardContent>
    <Box sx={{ p: 2, pt: 0 }}>
      <Button component={Link} to={`/accommodations/${accommodation._id}`} variant="contained" fullWidth>View Details</Button>
    </Box>
  </Paper>
);

// Skeleton Card for Loading State
const AccommodationCardSkeleton = () => (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Skeleton variant="rectangular" height={200} />
        <Box sx={{ p: 2 }}>
            <Skeleton height={30} width="80%" />
            <Skeleton height={20} width="40%" />
            <Skeleton height={40} sx={{mt: 2}}/>
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
            max={20000}
            step={500}
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
       <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Amenities</Typography></AccordionSummary>
        <AccordionDetails>
          <Stack>
            {options.amenities.map(amenity => (
              <FormControlLabel key={amenity} control={<Checkbox checked={filters.selectedAmenities.includes(amenity)} onChange={() => handleCheckboxChange('selectedAmenities', amenity)} />} label={amenity} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

const AccommodationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({ destinations: [], themes: [], amenities: [] });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: location.state?.search || '',
    priceRange: [0, 20000],
    selectedDestinations: [],
    selectedThemes: [],
    selectedAmenities: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [accRes, destRes, themesRes, amenitiesRes] = await Promise.all([
          fetch(getAllAccommodations),
          fetch(`${getAllAccommodations}/filters/destinations`),
          fetch(`${getAllAccommodations}/filters/themes`),
          fetch(`${getAllAccommodations}/filters/amenities`),
        ]);
        const accData = await accRes.json();
        const destinationsData = await destRes.json();
        const themesData = await themesRes.json();
        const amenitiesData = await amenitiesRes.json();
        
        setAccommodations(accData.data || []);
        setFilterOptions({ destinations: destinationsData, themes: themesData, amenities: amenitiesData });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter(acc => {
      if (!acc) return false;
      const searchMatch = acc.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || (acc.destination && acc.destination.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      const priceMatch = acc.price >= filters.priceRange[0] && acc.price <= filters.priceRange[1];
      const destinationMatch = filters.selectedDestinations.length === 0 || filters.selectedDestinations.includes(acc.destination);
      const themeMatch = filters.selectedThemes.length === 0 || filters.selectedThemes.some(theme => acc.themes?.includes(theme));
      const amenityMatch = filters.selectedAmenities.length === 0 || filters.selectedAmenities.every(amenity => acc.amenities?.includes(amenity));
      return searchMatch && priceMatch && destinationMatch && themeMatch && amenityMatch;
    });
  }, [accommodations, filters]);

  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Typography variant="h2" component="h1" fontWeight="700" sx={{ textAlign: 'center', mb: 4 }}>
        Find Your Perfect Stay
      </Typography>
      
      <Grid container spacing={4}>
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
              <FilterSidebar filters={filters} setFilters={setFilters} options={filterOptions} />
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search by stay name or destination..."
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

            {loading ? (
              <Grid container spacing={3}>
                {Array.from(new Array(9)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} lg={4}>
                    <AccommodationCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {filteredAccommodations.length > 0 ? (
                  filteredAccommodations.map(acc => (
                    <Grid item key={acc._id} xs={12} sm={6} lg={4}>
                      <AccommodationCard accommodation={acc} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6">No accommodations found</Typography>
                    <Typography color="text.secondary">Try adjusting your filters.</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </Stack>
        </Grid>
      </Grid>

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

export default AccommodationsPage;
