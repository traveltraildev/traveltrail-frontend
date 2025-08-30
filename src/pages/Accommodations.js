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
  InputAdornment,
  MenuItem
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { getAllAccommodations } from "../endpoints";
import { useTheme } from "@mui/material/styles";
import { Tune, ExpandMore, Search, KingBed, People } from "@mui/icons-material";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import FilterSidebarSkeleton from '../components/common/FilterSidebarSkeleton';

const AccommodationCard = ({ accommodation }) => {
  const theme = useTheme();
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] }, width: '100%' }}>
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
        <Typography variant="h5" fontWeight="700" color="primary">₹{accommodation.basePrice?.toLocaleString()}/night</Typography>
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

  const handleMaxOccupancyChange = (event, newValue) => {
    setLocalFilters((prev) => ({ ...prev, maxOccupancyRange: newValue }));
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
      priceRange: [0, 30000],
      maxOccupancyRange: [1, 10],
      selectedDestinations: [],
      selectedThemes: [],
      selectedAmenities: [],
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
            max={30000}
            step={1000}
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
          <Typography fontWeight="600">Sleeps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={localFilters.maxOccupancyRange}
            onChange={handleMaxOccupancyChange}
            valueLabelDisplay="auto"
            min={1}
            max={10}
            step={1}
            sx={{ ml: 1 }}
          />
           <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
            <Typography variant="body2">{localFilters.maxOccupancyRange[0]}</Typography>
            <Typography variant="body2">{localFilters.maxOccupancyRange[1]}</Typography>
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
      <Accordion>
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
          <Typography fontWeight="600">Amenities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack sx={{ maxHeight: 200, overflowY: "auto" }}>
            {options.amenities.map((amenity) => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox
                    checked={localFilters.selectedAmenities.includes(amenity)}
                    onChange={() =>
                      handleCheckboxChange("selectedAmenities", amenity)
                    }
                  />
                }
                label={amenity}
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

const AccommodationsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    destinations: [],
    themes: [],
    amenities: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const initialFilters = {
    searchTerm: location.state?.search || "",
    priceRange: [0, 30000],
    maxOccupancyRange: [1, 10],
    selectedDestinations: [],
    selectedThemes: [],
    selectedAmenities: [],
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [accResponse, destResponse, themesResponse, amenitiesResponse] =
          await Promise.all([
            fetch(getAllAccommodations),
            fetch(`${getAllAccommodations}/filters/destinations`),
            fetch(`${getAllAccommodations}/filters/themes`),
            fetch(`${getAllAccommodations}/filters/amenities`),
          ]);

        const accData = await accResponse.json();
        const destinations = await destResponse.json();
        const themes = await themesResponse.json();
        const amenities = await amenitiesResponse.json();

        setAccommodations(accData.data || []);
        setFilterOptions({
          destinations: destinations || [],
          themes: themes || [],
          amenities: amenities || [],
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

  const handleRemoveFilter = (filterType, value) => {
    const newFilters = { ...filters };
    if (filterType === "priceRange") {
      newFilters.priceRange = initialFilters.priceRange;
    } else if (filterType === "maxOccupancyRange") {
      newFilters.maxOccupancyRange = initialFilters.maxOccupancyRange;
    } else if (filterType === "searchTerm") {
      newFilters.searchTerm = "";
    } else {
      newFilters[filterType] = newFilters[filterType].filter(
        (item) => item !== value
      );
    }
    setFilters(newFilters);
  };

  const filteredAccommodations = useMemo(() => {
    const filtered = accommodations.filter((acc) => {
      if (!acc) return false;

      const searchMatch =
        acc.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (acc.destination &&
          acc.destination.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      const priceMatch =
        acc.basePrice >= filters.priceRange[0] && acc.basePrice <= filters.priceRange[1];

      const maxOccupancyMatch =
        acc.maxOccupancy >= filters.maxOccupancyRange[0] &&
        acc.maxOccupancy <= filters.maxOccupancyRange[1];

      const destinationMatch =
        filters.selectedDestinations.length === 0 ||
        filters.selectedDestinations.includes(acc.destination);

      const themeMatch =
        filters.selectedThemes.length === 0 ||
        filters.selectedThemes.some((theme) => acc.themes?.includes(theme));

      const amenityMatch =
        filters.selectedAmenities.length === 0 ||
        filters.selectedAmenities.some((amenity) =>
          acc.amenities?.includes(amenity)
        );

      return (
        searchMatch &&
        priceMatch &&
        maxOccupancyMatch &&
        destinationMatch &&
        themeMatch &&
        amenityMatch
      );
    });

    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "name_asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }, [accommodations, filters, sortBy]);

  const activeFilters = () => {
    const active = [];
    if (filters.searchTerm) {
      active.push({
        type: "searchTerm",
        value: `Search: "${filters.searchTerm}"`,
        display: `Search: "${filters.searchTerm}"`,
      });
    }
    if (
      filters.priceRange[0] !== initialFilters.priceRange[0] ||
      filters.priceRange[1] !== initialFilters.priceRange[1]
    ) {
      active.push({
        type: "priceRange",
        value: "Price",
        display: `Price: ₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`,
      });
    }
    if (
      filters.maxOccupancyRange[0] !== initialFilters.maxOccupancyRange[0] ||
      filters.maxOccupancyRange[1] !== initialFilters.maxOccupancyRange[1]
    ) {
      active.push({
        type: "maxOccupancyRange",
        value: "Sleeps",
        display: `Sleeps: ${filters.maxOccupancyRange[0]} - ${filters.maxOccupancyRange[1]}`,
      });
    }
    filters.selectedDestinations.forEach((dest) =>
      active.push({ type: "selectedDestinations", value: dest, display: dest })
    );
    filters.selectedThemes.forEach((theme) =>
      active.push({ type: "selectedThemes", value: theme, display: theme })
    );
    filters.selectedAmenities.forEach((amenity) =>
      active.push({ type: "selectedAmenities", value: amenity, display: amenity })
    );
    return active;
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 12 }, pb: 6 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            component="h1"
            fontWeight="700"
            sx={{ mb: 2 }}
          >
            Find Your Perfect Stay
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto" }}
          >
            Discover a wide range of accommodations, from cozy apartments to
            luxurious hotels. Use our filters to find the ideal place for your
            next getaway.
          </Typography>
        </Box>

        <Grid container spacing={isMobile ? 2 : 4}>
          {!isMobile && (
            <Grid item md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  position: "sticky",
                  top: 100,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ p: 2.5, pb: 1, fontWeight: 600 }}
                >
                  Filters
                </Typography>
                {loading ? (
                  <FilterSidebarSkeleton />
                ) : (
                  <FilterSidebar
                    initialFilters={filters}
                    onApply={handleApplyFilters}
                    onReset={handleResetFilters}
                    options={filterOptions}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />
                )}
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={9}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: "flex",
                  gap: 2,
                  position: "sticky",
                  top: isMobile ? 60 : 80, // Adjust for mobile header
                  bgcolor: "background.paper",
                  zIndex: 10,
                  border: isMobile ? `1px solid ${theme.palette.divider}` : "none",
                  borderRadius: isMobile ? 2 : 0,
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by stay name or destination..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                  sx={{ flexGrow: 1 }}
                />
                {isMobile && (
                  <IconButton
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{ border: `1px solid ${theme.palette.divider}` }}
                  >
                    <Tune />
                  </IconButton>
                )}
              </Paper>

              {activeFilters().length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", p: 1, gap: 1 }}
                >
                  {activeFilters().map((filter) => (
                    <Chip
                      key={filter.value}
                      label={filter.display}
                      onDelete={() =>
                        handleRemoveFilter(filter.type, filter.value)
                      }
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  <Chip
                    label="Clear All"
                    onClick={() => setFilters(initialFilters)}
                    color="error"
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                  />
                </Stack>
              )}

              {loading ? (
                <Grid container spacing={3} sx={{ margin: 0, width: "100%" }}>
                  {Array.from(new Array(9)).map((_, index) => (
                    <Grid
                      item
                      key={index}
                      xs={12}
                      sm={6}
                      lg={4}
                      sx={{
                        padding: { xs: "8px", sm: "12px", md: "16px" },
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <AccommodationCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={3} sx={{ margin: 0, width: "100%" }}>
                  {filteredAccommodations.length > 0 ? (
                    filteredAccommodations.map((acc) => (
                      <Grid
                        item
                        key={acc._id}
                        xs={12}
                        sm={6}
                        lg={4}
                        sx={{
                          padding: { xs: "8px", sm: "12px", md: "16px" },
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <AccommodationCard accommodation={acc} />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12} sx={{ textAlign: "center", py: 10 }}>
                      <Typography variant="h5">No Stays Found</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your search or filters to find what you're
                        looking for.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Drawer
          anchor="left"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{ sx: { width: 320 } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Filters
            </Typography>
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

export default AccommodationsPage;