// src/pages/Accommodations.js
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
  Autocomplete 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [maxOccupancy, setMaxOccupancy] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [allDestinations, setAllDestinations] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch("/api/accommodations");
        if (!response.ok) throw new Error("Failed to fetch accommodations");
        const data = await response.json();
        setAccommodations(data.data || []); // Handle null case
        setFilteredAccommodations(data.data || []);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        alert("Error loading accommodations. Check console.");
      }
    };

    fetchAccommodations();
  }, [navigate]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch destinations
        const destinationsResponse = await fetch("/api/accommodations/filters/destinations");
        const destinations = await destinationsResponse.json();
        setAllDestinations(destinations);

        // Fetch themes
        const themesResponse = await fetch("/api/accommodations/filters/themes");
        const themes = await themesResponse.json();
        setAllThemes(themes);

        // Fetch amenities
        const amenitiesResponse = await fetch("/api/accommodations/filters/amenities");
        const amenities = await amenitiesResponse.json();
        setAllAmenities(amenities);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterAccommodations();
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    filterAccommodations();
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    filterAccommodations();
  };

  const handleDestinationChange = (event) => {
    setSelectedDestinations(prev => 
      event.target.checked 
        ? [...prev, event.target.value] 
        : prev.filter(dest => dest !== event.target.value)
    );
    filterAccommodations();
  };

  const handleThemeChange = (event) => {
    const newThemes = event.target.checked
      ? [...selectedThemes, event.target.value]
      : selectedThemes.filter(theme => theme !== event.target.value);
    setSelectedThemes(newThemes);
    filterAccommodations();
  };

  const handleOccupancyChange = (event) => {
    setMaxOccupancy(event.target.value);
    filterAccommodations();
  };

  const handleAmenitiesChange = (event) => {
    const newAmenities = event.target.checked
      ? [...selectedAmenities, event.target.value]
      : selectedAmenities.filter(amenity => amenity !== event.target.value);
    setSelectedAmenities(newAmenities);
    filterAccommodations();
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const setActiveCategory = (category) => {
    setActiveFilterCategory(category);
  };

  const filterAccommodations = () => {
    let filtered = [...accommodations];
    
    // Search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(accommodation =>
        accommodation.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(accommodation =>
      accommodation.price >= priceRange[0] && accommodation.price <= priceRange[1]
    );

    // Destination filter
    if (selectedDestinations.length > 0) {
      filtered = filtered.filter(accommodation => 
        selectedDestinations.includes(accommodation.destination)
      );
    }

    // Theme filter
    if (selectedThemes.length > 0) {
      filtered = filtered.filter(accommodation => 
        selectedThemes.some(theme => 
          (accommodation.themes || []).includes(theme) // Handle undefined
        )
      );
    }

    // Occupancy filter
    if (maxOccupancy > 0) {
      filtered = filtered.filter(accommodation =>
        (accommodation.maxOccupancy || 0) >= maxOccupancy
      );
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(accommodation => 
        selectedAmenities.every(amenity => 
          (accommodation.amenities || []).includes(amenity) // Handle undefined
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      } else if (sortBy === "price-high") {
        return b.price - a.price;
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredAccommodations(filtered);
  };

  // Filter content components
  const renderFilterContent = () => {
    switch(activeFilterCategory) {
      case 'sort':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sort By
            </Typography>
            <RadioGroup
              value={sortBy}
              onChange={handleSortChange}
              row
            >
              <FormControlLabel
                value="name"
                control={<Radio />}
                label="Name"
              />
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
      case 'price':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBelow>
              Price Range
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              marks={[
                { value: 0, label: '₹0' },
                { value: 2000, label: '₹2000' },
                { value: 4000, label: '₹4000' },
                { value: 6000, label: '₹6000' },
                { value: 8000, label: '₹8000' },
                { value: 10000, label: '₹10000+' },
              ]}
              sx={{ width: '100%' }}
            />
          </Box>
        );
      case 'destinations':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBelow>
              Destinations
            </Typography>
            {allDestinations.map(destination => (
              <FormControlLabel
                key={destination}
                control={
                  <Checkbox 
                    checked={selectedDestinations.includes(destination)}
                    onChange={(e) => handleDestinationChange(e)}
                    value={destination}
                  />
                }
                label={destination}
              />
            ))}
          </Box>
        );
      case 'themes':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBelow>
              Themes
            </Typography>
            {allThemes.map(theme => (
              <FormControlLabel
                key={theme}
                control={
                  <Checkbox 
                    checked={selectedThemes.includes(theme)}
                    onChange={(e) => handleThemeChange(e)}
                    value={theme}
                  />
                }
                label={theme}
              />
            ))}
          </Box>
        );
      case 'occupancy':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBelow>
              Occupancy
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={maxOccupancy > 0}
                  onChange={(e) => setMaxOccupancy(e.target.checked ? 2 : 0)}
                />
              }
              label="Family-Friendly (2+ guests)"
            />
            {maxOccupancy > 0 && (
              <Autocomplete
                options={[2, 3, 4, 5, 6]}
                value={maxOccupancy}
                onChange={(e, value) => setMaxOccupancy(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Minimum Occupancy" />
                )}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        );
      case 'amenities':
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBelow>
              Amenities
            </Typography>
            {allAmenities.map(amenity => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox 
                    checked={selectedAmenities.includes(amenity)}
                    onChange={(e) => handleAmenitiesChange(e)}
                    value={amenity}
                  />
                }
                label={amenity}
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
        Explore Your Accommodations
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
            borderRadius: '50px', // Rounded edges
            overflow: 'hidden'
          }}
          InputProps={{
            style: {
              borderRadius: '50px', // Rounded input field
            },
          }}
        />
        
        {/* Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="Filters" 
            onClick={toggleFilterModal} 
            variant="outlined" 
            sx={{ cursor: 'pointer' }}
          />
          <Chip 
            label="Sort" 
            onClick={toggleFilterModal} 
            variant="outlined" 
            sx={{ cursor: 'pointer' }}
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
            borderRadius: '20px', // Rounded modal
            overflow: 'hidden',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }
        }}
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#f5f5f5', 
          py: 2,
          px: 3,
          borderRadius: '10px 10px 0 0'
        }}>
          Filter Options
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              {/* Left Pane with Filter Categories */}
              <List>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeFilterCategory === 'sort'}
                    onClick={() => setActiveCategory('sort')}
                  >
                    <ListItemText primary="Sort By" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeFilterCategory === 'price'}
                    onClick={() => setActiveCategory('price')}
                  >
                    <ListItemText primary="Price Range" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeFilterCategory === 'destinations'}
                    onClick={() => setActiveCategory('destinations')}
                  >
                    <ListItemText primary="Destinations" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeFilterCategory === 'themes'}
                    onClick={() => setActiveCategory('themes')}
                  >
                    <ListItemText primary="Themes" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeFilterCategory === 'occupancy'}
                    onClick={() => setActiveCategory('occupancy')}
                  >
                    <ListItemText primary="Occupancy" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeFilterCategory === 'amenities'}
                    onClick={() => setActiveCategory('amenities')}
                  >
                    <ListItemText primary="Amenities" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={9}>
              {renderFilterContent()}
            </Grid>
          </Grid>
        </DialogContent>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          px: 3, 
          py: 2, 
          borderTop: '1px solid #e0e0e0' 
        }}>
          <Button onClick={toggleFilterModal} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={filterAccommodations}>
            Apply Filters
          </Button>
        </Box>
      </Dialog>

      <Grid container spacing={4} justifyContent="center">
        {filteredAccommodations.map((accommodation) => (
          <Grid item key={accommodation.id} xs={12} sm={6} md={4}>
            <Card
              sx={({
                borderRadius: 15,
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  boxShadow: 24,
                  transform: 'translateY(-5px)'
                },
                bgcolor: 'background.paper'
              })}>
              <CardMedia
                component="img"
                height="200"
                image={accommodation?.images?.[0] || "./images/defaultImg.png"}
                alt={accommodation?.name || ""}
                sx={({
                  objectFit: 'cover',
                  width: '100%'
                })}>
              </CardMedia>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {accommodation?.name}
                  </Typography>
                  <Chip 
                    label={`${accommodation?.price} ₹`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, lineHeight: 1.4 }}
                >
                  {accommodation?.overview?.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {(accommodation?.themes || []).map((theme) => (
                    <Chip 
                      key={theme}
                      label={theme}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {accommodation?.destination}
                  </Typography>
                  <Button
                    component={Link}
                    to={accommodation?._id}
                    variant="contained"
                    sx={({
                      px: 2, 
                      py: 0.5, 
                      fontSize: '0.875rem',
                      bgcolor: '#004d40',
                      '&:hover': { bgcolor: '#002c25' }
                    })}>
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

export default Accommodations;