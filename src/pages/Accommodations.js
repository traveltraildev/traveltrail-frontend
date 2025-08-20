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
  Skeleton,
  InputAdornment
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAllAccommodations } from "../endpoints";
import { useTheme } from "@mui/material/styles";
import { Tune, ExpandMore, Search, KingBed, People } from "@mui/icons-material";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const AccommodationCard = ({ accommodation }) => {
  const theme = useTheme();
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] } }}>
      <CardMedia
        component="img"
        height="220"
        image={accommodation?.images[0] || "/images/placeholder.jpg"}
        alt={accommodation?.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" fontWeight="600" noWrap>{accommodation.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{accommodation.destination}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
          <Chip icon={<KingBed />} label={accommodation.roomType} size="small" variant="outlined" />
          <Chip icon={<People />} label={`${accommodation.maxOccupancy} Guests`} size="small" variant="outlined" />
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">₹{accommodation.price?.toLocaleString()}/night</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={Link} to={`/accommodations/${accommodation._id}`} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  )
};

const AccommodationCardSkeleton = () => (
    <Card sx={{ borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={220} />
        <CardContent>
            <Skeleton height={30} width="80%" />
            <Skeleton height={20} width="40%" sx={{mt: 1}}/>
            <Skeleton height={45} sx={{mt: 2}}/>
        </CardContent>
    </Card>
);


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
    <Stack spacing={2} sx={{ p: 2.5 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Price Range</Typography></AccordionSummary>
        <AccordionDetails>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={30000}
            step={1000}
            sx={{ml: 1}}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Destinations</Typography></AccordionSummary>
        <AccordionDetails>
          <Stack sx={{maxHeight: 200, overflowY: 'auto'}}>
            {options.destinations.map(dest => (
              <FormControlLabel key={dest} control={<Checkbox checked={filters.selectedDestinations.includes(dest)} onChange={() => handleCheckboxChange('selectedDestinations', dest)} />} label={dest} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Themes</Typography></AccordionSummary>
        <AccordionDetails>
          <Stack sx={{maxHeight: 200, overflowY: 'auto'}}>
            {options.themes.map(theme => (
              <FormControlLabel key={theme} control={<Checkbox checked={filters.selectedThemes.includes(theme)} onChange={() => handleCheckboxChange('selectedThemes', theme)} />} label={theme} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
       <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight="600">Amenities</Typography></AccordionSummary>
        <AccordionDetails>
          <Stack sx={{maxHeight: 200, overflowY: 'auto'}}>
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
    priceRange: [0, 30000],
    selectedDestinations: [],
    selectedThemes: [],
    selectedAmenities: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAllAccommodations);
        const accData = await response.json();
        const data = accData.data || [];
        setAccommodations(data);

        const destinations = [...new Set(data.map(item => item.destination).filter(Boolean))];
        const themes = [...new Set(data.flatMap(item => item.themes).filter(Boolean))];
        const amenities = [...new Set(data.flatMap(item => item.amenities).filter(Boolean))];
        setFilterOptions({ destinations, themes, amenities });

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
    <>
    <Navbar />
    <Container maxWidth="xl" sx={{ pt: 12, pb: 6 }}>
      <Typography variant="h2" component="h1" fontWeight="700" sx={{ textAlign: 'center', mb: 2 }}>
        Find Your Perfect Stay
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: '600px', mx: 'auto' }}>
        From cozy apartments to luxurious villas, discover the perfect accommodation for your next getaway.
      </Typography>
      
      <Grid container spacing={4}>
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={0} sx={{ p: 0, position: 'sticky', top: 100, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ p: 2.5, pb: 1, fontWeight: 600 }}>Filters</Typography>
              <FilterSidebar filters={filters} setFilters={setFilters} options={filterOptions} />
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by stay name or destination..."
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
                    <AccommodationCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3} sx={{ margin: 0, width: '100%' }}>
                {filteredAccommodations.length > 0 ? (
                  filteredAccommodations.map(acc => (
                    <Grid item key={acc._id} xs={12} sm={6} lg={4} sx={{ padding: { xs: '8px', sm: '12px', md: '16px' } }}>
                      <AccommodationCard accommodation={acc} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12} sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5">No Stays Found</Typography>
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
          <FilterSidebar filters={filters} setFilters={setFilters} options={filterOptions} />
          <Button fullWidth variant="contained" onClick={() => setMobileFiltersOpen(false)} sx={{ mt: 3 }}>Apply Filters</Button>
        </Box>
      </Drawer>
    </Container>
    <Footer />
    </>
  );
};

export default AccommodationsPage;