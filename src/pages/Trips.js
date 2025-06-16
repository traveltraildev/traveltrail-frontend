// --- START OF FILE src/components/TripsCard.js ---

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Chip,
  Slider,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  useMediaQuery,
  Fade,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllTrips } from "../endpoints";
import BookNow from "../components/TripDetails/BookNow";
import { Close } from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Slide from "@mui/material/Slide";
import { useScrollTrigger } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";
import Tune from "@mui/icons-material/Tune";
import { TripListSkeleton } from "../components/common/TripCardSkeleton"; // Added import

import { motion } from "framer-motion";



const TripsCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [headerState, setHeaderState] = useState({
    isScrolledTop: true,
    isExpanded: true,
    scrollPosition: 0,
  });

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState("sort");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const location = useLocation();
  const preSearchData = location.state;

  const [filterState, setFilterState] = useState({
    sortBy: "name",
    priceRange: [0, 1000000],
    selectedDestinations: [],
    selectedThemes: [],
    selectedInclusions: [],
    selectedExclusions: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    destinations: [],
    themes: [],
    inclusions: [],
    exclusions: [],
  });
  const navigate = useNavigate();


  const preSearch = location?.state?.search;

  useEffect(() => {
    if (preSearch?.length > 0) {
      setSearchTerm(preSearch);
    }
  }, [preSearch]);


  // Fetch trips data
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true); // Set loading true at the start
      try {
        const response = await fetch(getAllTrips);
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();
        setTrips(data);
        setFilteredTrips(data); // Assuming initial display shows all trips
      } catch (error) {
        console.error("Error fetching trips:", error);
        alert("Error loading trips. Check console.");
        setTrips([]); // Clear trips on error
        setFilteredTrips([]); // Clear filtered trips on error
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
    };

    fetchTrips();
  }, [navigate]); // navigate dependency might be removable if not used in fetchTrips

  useEffect(() => {
    if (preSearchData?.search?.length > 0) {
      setSearchTerm(preSearchData?.search);
    }
  }, [preSearchData]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [
          destinationsResponse,
          themesResponse,
          inclusionsResponse,
          exclusionsResponse,
        ] = await Promise.all([
          fetch(`${getAllTrips}/filters/destinations`),
          fetch(`${getAllTrips}/filters/themes`),
          fetch(`${getAllTrips}/filters/inclusions`),
          fetch(`${getAllTrips}/filters/exclusions`),
        ]);

        const destinations = await destinationsResponse.json();
        const themes = await themesResponse.json();
        const inclusions = await inclusionsResponse.json();
        const exclusions = await exclusionsResponse.json();

        setFilterOptions({
          destinations,
          themes,
          inclusions,
          exclusions,
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Apply filters when any filter state changes
  useEffect(() => {
    applyFilters();
  }, [filterState, trips, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (newFilterState) => {
    setFilterState((prev) => ({ ...prev, ...newFilterState }));
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const applyFilters = () => {
    let filtered = [...trips];

    // Search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((trip) =>
        trip.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (trip) =>
        trip.price >= filterState.priceRange[0] &&
        trip.price <= filterState.priceRange[1]
    );

    // Destination filter
    if (filterState.selectedDestinations.length > 0) {
      filtered = filtered.filter((trip) =>
        filterState.selectedDestinations.includes(trip.destination)
      );
    }

    // Theme filter
    if (filterState.selectedThemes.length > 0) {
      filtered = filtered.filter((trip) =>
        filterState.selectedThemes.some((theme) =>
          (trip.themes || []).includes(theme)
        )
      );
    }

    // Inclusions filter
    if (filterState.selectedInclusions.length > 0) {
      filtered = filtered.filter((trip) =>
        filterState.selectedInclusions.every((inclusion) =>
          (trip.inclusions || []).includes(inclusion)
        )
      );
    }

    // Exclusions filter
    if (filterState.selectedExclusions.length > 0) {
      filtered = filtered.filter((trip) =>
        filterState.selectedExclusions.every((exclusion) =>
          (trip.exclusions || []).includes(exclusion)
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (filterState.sortBy === "price-low") {
        return a.price - b.price;
      } else if (filterState.sortBy === "price-high") {
        return b.price - a.price;
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredTrips(filtered);
  };

  const renderFilterContent = () => {
    switch (activeFilterCategory) {
      case "sort":
        return (
          <Box sx={{ mt: 3 }}>
            <RadioGroup
              value={filterState.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              row
            >
              <FormControlLabel value="name" control={<Radio />} label="Name" />
              <FormControlLabel
                value="price-low"
                control={<Radio />}
                label="Price: Low to High"
              />
              <FormControlLabel
                value="price-high"
                control={<Radio />}
                label="Price: High to Low"
              />
            </RadioGroup>
          </Box>
        );
      case "price":
        return (
          <Box sx={{ mt: 3 }}>
            <Slider
              value={filterState.priceRange}
              onChange={(e, newValue) =>
                handleFilterChange({ priceRange: newValue })
              }
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              marks={[
                { value: 0, label: "₹0" },
                { value: 2000, label: "₹2000" },
                { value: 4000, label: "₹4000" },
                { value: 6000, label: "₹6000" },
                { value: 8000, label: "₹8000" },
                { value: 10000, label: "₹10000+" },
              ]}
              sx={{ width: "100%" }}
            />
          </Box>
        );
      case "destinations":
        return (
          <Box sx={{ mt: 3 }}>
            {filterOptions.destinations.map((destination) => (
              <FormControlLabel
                key={destination}
                control={
                  <Checkbox
                    checked={filterState.selectedDestinations.includes(
                      destination
                    )}
                    onChange={(e) =>
                      handleFilterChange({
                        selectedDestinations: e.target.checked
                          ? [...filterState.selectedDestinations, destination]
                          : filterState.selectedDestinations.filter(
                            (d) => d !== destination
                          ),
                      })
                    }
                  />
                }
                label={destination}
              />
            ))}
          </Box>
        );
      case "themes":
        return (
          <Box sx={{ mt: 3 }}>
            {filterOptions.themes.map((theme) => (
              <FormControlLabel
                key={theme}
                control={
                  <Checkbox
                    checked={filterState.selectedThemes.includes(theme)}
                    onChange={(e) =>
                      handleFilterChange({
                        selectedThemes: e.target.checked
                          ? [...filterState.selectedThemes, theme]
                          : filterState.selectedThemes.filter(
                            (t) => t !== theme
                          ),
                      })
                    }
                  />
                }
                label={theme}
              />
            ))}
          </Box>
        );
      case "inclusions":
        return (
          <Box sx={{ mt: 3 }}>
            {filterOptions.inclusions.map((inclusion) => (
              <FormControlLabel
                key={inclusion}
                control={
                  <Checkbox
                    checked={filterState.selectedInclusions.includes(inclusion)}
                    onChange={(e) =>
                      handleFilterChange({
                        selectedInclusions: e.target.checked
                          ? [...filterState.selectedInclusions, inclusion]
                          : filterState.selectedInclusions.filter(
                            (i) => i !== inclusion
                          ),
                      })
                    }
                  />
                }
                label={inclusion}
              />
            ))}
          </Box>
        );
      case "exclusions":
        return (
          <Box sx={{ mt: 3 }}>
            {filterOptions.exclusions.map((exclusion) => (
              <FormControlLabel
                key={exclusion}
                control={
                  <Checkbox
                    checked={filterState.selectedExclusions.includes(exclusion)}
                    onChange={(e) =>
                      handleFilterChange({
                        selectedExclusions: e.target.checked
                          ? [...filterState.selectedExclusions, exclusion]
                          : filterState.selectedExclusions.filter(
                            (e) => e !== exclusion
                          ),
                      })
                    }
                  />
                }
                label={exclusion}
              />
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  // Gradient text styling
  const gradientText = {
    background: 'linear-gradient(45deg, #f57f17 30%, #ffca28 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    letterSpacing: '-0.5px'
  };

  return (
    <Box sx={{
      padding: (theme) => ({ xs: `${theme.spacing(10)} ${theme.spacing(2)}`, md: `${theme.spacing(12.5)} ${theme.spacing(4)}` }),
      backgroundColor: (theme) => theme.palette.background.default,
    }}>
      <Box sx={{
        pt: { xs: 2, md: 4 },
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 1200,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.8)"
      }}>
        {/* Header Title */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            ...gradientText,
            fontSize: { xs: '1.75rem', md: '2.75rem' },
            px: 2,
            mb: { xs: 2, md: 4 }
          }}
        >
          Explore Adventures
        </Typography>



        {/* Search Bar */}
        <Box sx={{
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          mb: { xs: 1, md: 3 },
          px: 2
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search trips by name..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
              endAdornment: (
                <Button
                  variant="contained"
                  color="secondary" // Changed from warning
                  aria-label={useMediaQuery(theme.breakpoints.up("md")) ? undefined : "Search trips"}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    px: { xs: 1.5, md: 3 },
                    minWidth: { xs: "auto", md: "100px" },
                    borderRadius: "0 8px 8px 0"
                  }}
                >
                  {useMediaQuery(theme.breakpoints.up("md")) ? "Search" : <SearchIcon />}
                </Button>
              ),
              sx: {
                borderRadius: "8px",
                bgcolor: "background.default",
                boxShadow: 3,
                pr: { xs: 8, md: 10 },
                height: { xs: "48px", md: "56px" }
              }
            }}
          />
        </Box>

        {/* Filter Chips */}
        <Box sx={{
          display: "flex",
          gap: 1,
          justifyContent: "flex-start",
          flexWrap: "nowrap",
          overflowX: "auto",
          px: 2,
          pb: 1,
          mx: { xs: -2, md: 0 },
          '&::-webkit-scrollbar': {
            height: '3px',
            backgroundColor: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'text.secondary',
            borderRadius: 2
          }
        }}>
          <Chip
            label="Filters"
            onClick={toggleFilterModal}
            icon={<Tune fontSize="small" />}
            variant="outlined"
            sx={{
              borderColor: theme.palette.divider, // Changed from grey.300
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.1) }, // Changed from warning.light
              flexShrink: 0
            }}
          />
          {filterState.sortBy !== "name" && (
            <Chip
              label={`Sort: ${filterState.sortBy === "price-low" ? "Low" : "High"}`}
              onDelete={() => handleFilterChange({ sortBy: "name" })}
              sx={{
                bgcolor: theme.palette.secondary.light, // Changed from warning.light
                '.MuiChip-deleteIcon': { color: theme.palette.secondary.dark }, // Changed from warning.dark
                flexShrink: 0
              }}
            />
          )}
          {(filterState.priceRange[0] !== 0 || filterState.priceRange[1] !== 1000000) && (
            <Chip
              label={`₹${filterState.priceRange[0]}-${filterState.priceRange[1]}`}
              onDelete={() => handleFilterChange({ priceRange: [0, 1000000] })}
              sx={{
                bgcolor: theme.palette.secondary.light, // Changed from warning.light
                '.MuiChip-deleteIcon': { color: theme.palette.secondary.dark }, // Changed from warning.dark
                flexShrink: 0
              }}
            />
          )}
          {filterState.selectedDestinations.map(destination => (
            <Chip
              key={destination}
              label={destination}
              onDelete={() => handleFilterChange({
                selectedDestinations: filterState.selectedDestinations.filter(d => d !== destination)
              })}
              sx={{
                bgcolor: theme.palette.secondary.light, // Changed from warning.light
                '.MuiChip-deleteIcon': { color: theme.palette.secondary.dark }, // Changed from warning.dark
                flexShrink: 0
              }}
            />
          ))}
          {filterState.selectedThemes.map(theme => ( // Corrected: iterator name is 'theme' in the original code
            <Chip
              key={theme}
              label={theme}
              onDelete={() => handleFilterChange({
                selectedThemes: filterState.selectedThemes.filter(t => t !== theme)
              })}
              sx={{
                bgcolor: theme.palette.secondary.light, // Changed from warning.light
                '.MuiChip-deleteIcon': { color: theme.palette.secondary.dark }, // Changed from warning.dark
                flexShrink: 0
              }}
            />
          ))}
          {filterState.selectedInclusions.map(inclusion => (
            <Chip
              key={inclusion}
              label={inclusion}
              onDelete={() => handleFilterChange({
                selectedInclusions: filterState.selectedInclusions.filter(i => i !== inclusion)
              })}
              sx={{
                bgcolor: theme.palette.secondary.light, // Changed from warning.light
                '.MuiChip-deleteIcon': { color: theme.palette.secondary.dark }, // Changed from warning.dark
                flexShrink: 0
              }}
            />
          ))}
          {filterState.selectedExclusions.map(exclusion => (
            <Chip
              key={exclusion}
              label={exclusion}
              onDelete={() => handleFilterChange({
                selectedExclusions: filterState.selectedExclusions.filter(e => e !== exclusion)
              })}
              sx={{
                bgcolor: theme.palette.secondary.light, // Changed from warning.light
                '.MuiChip-deleteIcon': { color: theme.palette.secondary.dark }, // Changed from warning.dark
                flexShrink: 0
              }}
            />
          ))}
        </Box>





      </Box>


      {/* Filter Modal */}
      <Dialog
        open={isFilterModalOpen}
        onClose={toggleFilterModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
            border: "1px solid",
            borderColor: "divider"
          }
        }}
        TransitionComponent={Fade}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.secondary.main, // Changed from warning.main
            color: theme.palette.secondary.contrastText, // Changed from common.white
            py: 2,
            px: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filter Options
          </Typography>
          <IconButton onClick={toggleFilterModal} sx={{ color: theme.palette.secondary.contrastText }} aria-label="Close filter options dialog"> {/* Changed color */}
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <List sx={{ '& .MuiListItemButton-root': { borderRadius: 2 } }}>
                {['sort', 'price', 'destinations', 'themes', 'inclusions', 'exclusions'].map((category) => (
                  <ListItem key={category} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={activeFilterCategory === category}
                      onClick={() => setActiveFilterCategory(category)}
                      sx={{
                        bgcolor: activeFilterCategory === category ? theme.palette.secondary.light : 'transparent', // Changed from warning.light
                        '&:hover': { bgcolor: 'action.hover' },
                        borderLeft: `4px solid ${activeFilterCategory === category ? theme.palette.secondary.main : 'transparent'}` // Changed from warning.main
                      }}
                    >
                      <ListItemText
                        primary={category.charAt(0).toUpperCase() + category.slice(1)}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: activeFilterCategory === category ? theme.palette.secondary.dark : theme.palette.text.primary // Changed from warning.dark
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={9}>
              <Box sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
                pr: 2,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'text.secondary',
                  borderRadius: '4px'
                }
              }}>
                {renderFilterContent()}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }}>
          <Button
            onClick={toggleFilterModal}
            variant="outlined"
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              '&:hover': { borderColor: "text.secondary" }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary" // Changed from warning
            onClick={applyFilters}
            sx={{
              px: 4,
              fontWeight: 600,
              boxShadow: 1,
              '&:hover': { boxShadow: 2 }
            }}
          >
            Show Results
          </Button>
        </Box>
      </Dialog>

      {/* Results Header */}
      <Box sx={{
        textAlign: "center",
        py: 3,
        mb: 4,
        bgcolor: "background.paper",
        borderBottom: "2px solid",
        borderTop: "2px solid",
        borderColor: "divider",
        mx: { xs: -2, md: 0 },
        px: 2,
        position: "sticky",
        top: { xs: 56, md: 64 },
        zIndex: 1100,
        backdropFilter: "blur(8px)"
      }}>
        <Typography variant="h5" sx={{
          ...gradientText,
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 600,
          letterSpacing: '-0.03rem',
          lineHeight: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5
        }}>
          {filteredTrips.length} {filteredTrips.length === 1 ? 'Trip' : 'Trips'} Found
        </Typography>
      </Box>

      {/* Trips Grid */}
      {loading ? (
        <TripListSkeleton count={6} /> // Display 6 skeletons while loading
      ) : filteredTrips && filteredTrips.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {filteredTrips.map((trip) => (
            <Grid
              item
            key={trip._id}
            xs={12}
            sm={6}
            md={4}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                width: "100%",
                height: { xs: "100%" },
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: theme.shadows[2], // Changed shadow
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: { sm: theme.shadows[4] }, // Changed hover shadow
                  transform: { sm: "translateY(-3px)" },
                },
                transition: { sm: "transform 0.3s ease, box-shadow 0.3s ease" }, // Added box-shadow to transition
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  pt: { xs: "50%", sm: "56.25%" }, // Adjusted aspect ratio
                  overflow: "hidden",
                  bgcolor: "grey.100",
                }}
              >
                <CardMedia
                  component="img"
                  image={trip?.images[0] || "./images/defaultImg.png"}
                  alt={trip?.name || ""}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Chip
                  label={`${trip?.daysCount} days`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "rgba(0,0,0,0.7)",
                    color: "#fff8e1",
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                {/* Trip Info */}
                <Box
                  sx={{
                    flex: 1,
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="600"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "#212121",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    {trip?.name || ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "#616161",
                      fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    }}
                  >
                    {trip?.destination}
                  </Typography>
                </Box>

                {/* Price Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: theme.palette.primary.main, // Changed color
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    Starts from
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="600"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    ₹{trip?.price?.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      opacity: 0.8,
                    }}
                  >
                    /person
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: "auto",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => setSelectedTrip(trip)}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      bgcolor: theme.palette.primary.main, // Changed bgcolor
                      color: theme.palette.primary.contrastText, // Changed color
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark, // Changed hover bgcolor
                        boxShadow: theme.shadows[1], // Use theme shadow
                      },
                    }}
                  >
                    Book Now
                  </Button>
                  <Button
                    component={Link}
                    to={`/trips/${trip?._id}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      borderRadius: "6px",
                      textTransform: "none",
                      borderColor: theme.palette.secondary.main, // Changed borderColor
                      color: theme.palette.secondary.main, // Changed color
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      "&:hover": {
                        borderColor: theme.palette.secondary.dark, // Changed hover borderColor
                        color: theme.palette.secondary.dark, // Changed hover color
                        bgcolor: alpha(theme.palette.secondary.main, 0.08), // Changed hover bgcolor
                      },
                    }}
                  >
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          ))}
        </Grid>
      ) : (
        !loading && <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>No trips found matching your criteria.</Typography>
      )}
      <Dialog
        open={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "visible",
            backgroundColor: theme.palette.background.paper, // Changed background color
          },
        }}
      >
        <Box sx={{ position: "absolute", right: 16, top: 16 }}>
          <IconButton
            onClick={() => setSelectedTrip(null)}
            sx={{ color: theme.palette.primary.main }} // Changed color
            aria-label="Close booking dialog"
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <BookNow
            trip={selectedTrip}
            onSuccess={() => setSelectedTrip(null)}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default TripsCard;
// --- END OF FILE src/components/TripsCard.js ---