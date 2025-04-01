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
  Autocomplete,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllTrips } from "../endpoints";

const TripsCard = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState("sort");
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

  const location = useLocation();
  const preSearch = location?.state?.search;

  useEffect(() => {
    if (preSearch?.length > 0) {
      setSearchTerm(preSearch);
    }
  }, [preSearch]);

  // Fetch trips data
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(getAllTrips);
        if (!response.ok) throw new Error("Failed to fetch trips");
        const data = await response.json();
        setTrips(data);
        setFilteredTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
        alert("Error loading trips. Check console.");
      }
    };

    fetchTrips();
  }, [navigate]);

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

  return (
    <Box sx={{ padding: "100px 7%", backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        fontWeight="bold"
        color="#000"
        marginBottom={"30px"}
      >
        Explore Your Next Adventure
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          sx={{
            mb: 2,
            borderRadius: "50px",
            overflow: "hidden",
          }}
          InputProps={{
            style: {
              borderRadius: "50px",
            },
          }}
        />

        {/* Filter Chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label="Filters"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("sort");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Sort"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("sort");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Price"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("price");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Destinations"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("destinations");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Themes"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("themes");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Inclusions"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("inclusions");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
          <Chip
            label="Exclusions"
            onClick={() => {
              toggleFilterModal();
              setActiveFilterCategory("exclusions");
            }}
            variant="outlined"
            sx={{ cursor: "pointer" }}
          />
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
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          },
        }}
        TransitionComponent={Fade}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f5f5f5",
            py: 2,
            px: 3,
            borderRadius: "10px 10px 0 0",
          }}
        >
          Filter Options
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              {/* Left Pane with Filter Categories */}
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeFilterCategory === "sort"}
                    onClick={() => setActiveFilterCategory("sort")}
                  >
                    <ListItemText primary="Sort By" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeFilterCategory === "price"}
                    onClick={() => setActiveFilterCategory("price")}
                  >
                    <ListItemText primary="Price Range" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeFilterCategory === "destinations"}
                    onClick={() => setActiveFilterCategory("destinations")}
                  >
                    <ListItemText primary="Destinations" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeFilterCategory === "themes"}
                    onClick={() => setActiveFilterCategory("themes")}
                  >
                    <ListItemText primary="Themes" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeFilterCategory === "inclusions"}
                    onClick={() => setActiveFilterCategory("inclusions")}
                  >
                    <ListItemText primary="Inclusions" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeFilterCategory === "exclusions"}
                    onClick={() => setActiveFilterCategory("exclusions")}
                  >
                    <ListItemText primary="Exclusions" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={9}>
              {renderFilterContent()}
            </Grid>
          </Grid>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 3,
            py: 2,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button onClick={toggleFilterModal} sx={{ color: "#f57f17", mr: 1 }}>
            Cancel
          </Button>
          <Button
            sx={{
              bgcolor: "#f57f17",
            }}
            variant="contained"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </Box>
      </Dialog>

      {/* Trips Grid */}
      <Grid container spacing={4} justifyContent="center">
        {filteredTrips.map((trip) => (
          <Grid item key={trip._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  transform: "translateY(-3px)",
                },
                bgcolor: "background.paper",
                p: 1,
                height: "100%",
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={trip?.images[0] || "./images/defaultImg.png"}
                alt={trip?.name || ""}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                }}
              />
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 0.5 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
                    {trip?.name || ""}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {trip?.destination} (₹ {trip?.price || ""})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: "auto",
                  }}
                >
                  <Chip
                    label={`${trip?.price} ₹`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                  />
                  <Button
                    component={Link}
                    to={`/trips/${trip?._id}`}
                    variant="contained"
                    sx={{
                      px: 2,
                      py: 0.5,
                      fontSize: "0.875rem",
                      bgcolor: "#2196f3",
                      color: "white",
                      "&:hover": { bgcolor: "#0d8bf2" },
                      borderRadius: "25px",
                      textTransform: "none",
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TripsCard;
// --- END OF FILE src/components/TripsCard.js ---
