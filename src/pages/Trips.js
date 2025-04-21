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
import { motion } from "framer-motion";

const CollapsibleHeader = styled(AppBar)(({ theme }) => ({
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  backdropFilter: "blur(8px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
}));

const MobileHeader = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, "7%"),
  backgroundColor: alpha(theme.palette.background.paper, 0.97),
  backdropFilter: "blur(8px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: theme.shadows[2],
}));

const FloatingSearch = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 56, // Height of mobile header
  left: 0,
  right: 0,
  zIndex: 1099,
  padding: theme.spacing(1, "7%"),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

const Logo = styled(Box)(({ theme }) => ({
  width: "120px", // Adjust the width as needed
  height: "40px", // Adjust the height as needed
  marginRight: "10px", // Add some spacing
  objectFit: "contain", // Maintain aspect ratio
}));

const TripsCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [headerState, setHeaderState] = useState({
    isScrolledTop: true,
    isExpanded: true,
    scrollPosition: 0,
  });

  // Debounced scroll handler
  const handleScroll = debounce(() => {
    const currentScroll = window.scrollY;
    const isTop = currentScroll < 10;
    const isScrollingUp = currentScroll < headerState.scrollPosition;
    const pastThreshold = currentScroll > 100;

    setHeaderState((prev) => ({
      scrollPosition: currentScroll,
      isScrolledTop: isTop,
      isExpanded: isTop || (isScrollingUp && pastThreshold),
    }));
  }, 50);

  const [trips, setTrips] = useState([]);
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

  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const preSearch = location?.state?.search;

  useEffect(() => {
    if (preSearch?.length > 0) {
      setSearchTerm(preSearch);
    }
  }, [preSearch]);

  useEffect(() => {
    if (!isMobile) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isScrollingUp = currentScroll < lastScroll;

      setShowMobileSearch(isScrollingUp && currentScroll > 100);
      setIsNavbarVisible(currentScroll < 50 || isScrollingUp);
      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

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

  return (
    <Box
      sx={{
        padding: "100px 7%",
        backgroundColor: "#f5f5f5",
        pt: { xs: headerState.isExpanded ? "160px" : "100px", sm: "100px" },
        transition: "padding-top 0.3s ease",
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          sx={{
            transform: `translateY(${headerState.isExpanded ? 0 : "-100%"})`,
            height: headerState.isScrolledTop ? 88 : 56,
          }}
        >
          {/* Logo with scale animation */}
          <motion.div
            animate={{ scale: headerState.isScrolledTop ? 1 : 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Logo>
              <img
                src="/images/mainLogo.svg"
                alt="Travel Trail"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Logo>
          </motion.div>

          {/* Search Bar with width animation */}
          <motion.div
            style={{ flexGrow: 1 }}
            animate={{
              opacity: headerState.isExpanded ? 1 : 0,
              width: headerState.isExpanded ? "auto" : 0,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                sx: {
                  borderRadius: 28,
                  backgroundColor: alpha(theme.palette.common.white, 0.9),
                  height: 40,
                },
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />
          </motion.div>

          {/* Menu Button with fade animation */}
          <Fade in={!headerState.isScrolledTop}>
            <IconButton sx={{ flexShrink: 0 }}>
              <MenuIcon />
            </IconButton>
          </Fade>
        </MobileHeader>
      )}
      {/* Desktop Header */}
      {!isMobile && (
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            fontWeight="bold"
            sx={{
              mb: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Explore Adventures
          </Typography>

          <Box
            sx={{
              position: "relative",
              maxWidth: 600,
              mx: "auto",
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search trips by name..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  boxShadow: 3,
                  pr: 1,
                  backgroundColor: "background.paper",
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <SearchIcon sx={{ color: "common.white" }} />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      )}

      {/* Filter Chips */}

      <Slide
        in={headerState.isExpanded}
        direction="down"
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: { xs: "nowrap", sm: "wrap" },
            overflowX: { xs: "auto", sm: "visible" },
            pb: 1,
            mx: { xs: "-7%", sm: 0 },
            px: { xs: "7%", sm: 0 },
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
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
      </Slide>

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
      <Grid container spacing={2} justifyContent="center">
        {filteredTrips?.map((trip) => (
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
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                bgcolor: "background.paper",
                "&:hover": {
                  boxShadow: { sm: "0 8px 16px rgba(0, 0, 0, 0.1)" },
                  transform: { sm: "translateY(-3px)" },
                },
                transition: { sm: "transform 0.3s ease" },
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
                    color: "#f57f17",
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
                      bgcolor: "#f57f17",
                      color: "#fff",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      "&:hover": {
                        bgcolor: "#ff6f00",
                        boxShadow: 1,
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
                      borderColor: "#ffc107",
                      color: "#ffc107",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      "&:hover": {
                        borderColor: "#ffa000",
                        color: "#ffa000",
                        bgcolor: "#fff8e1",
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
      <Dialog
        open={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "visible",
            backgroundColor: "#fff8e1",
          },
        }}
      >
        <Box sx={{ position: "absolute", right: 16, top: 16 }}>
          <IconButton
            onClick={() => setSelectedTrip(null)}
            sx={{ color: "#f57f17" }}
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
