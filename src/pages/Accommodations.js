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
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from "react-router-dom";
import { getAllAccommodations } from "../endpoints";
import { Tune, Close, Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState("sort");
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
  const theme = useTheme(); // Add this line

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accResponse, destinations, themes, amenities] = await Promise.all([
          fetch(getAllAccommodations),
          fetch(`${getAllAccommodations}/filters/destinations`),
          fetch(`${getAllAccommodations}/filters/themes`),
          fetch(`${getAllAccommodations}/filters/amenities`)
        ]);

        const accData = await accResponse.json();
        setAccommodations(accData.data || []);
        setFilteredAccommodations(accData.data || []);

        setAllDestinations(await destinations.json());
        setAllThemes(await themes.json());
        setAllAmenities(await amenities.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    filterAccommodations();
  }, [searchTerm, sortBy, priceRange, selectedDestinations, selectedThemes, maxOccupancy, selectedAmenities]);

  const filterAccommodations = () => {
    let filtered = accommodations.filter(acc => 
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      acc.price >= priceRange[0] &&
      acc.price <= priceRange[1] &&
      (selectedDestinations.length === 0 || selectedDestinations.includes(acc.destination)) &&
      (selectedThemes.length === 0 || selectedThemes.some(theme => acc.themes?.includes(theme))) &&
      (maxOccupancy === 0 || acc.maxOccupancy >= maxOccupancy) &&
      (selectedAmenities.length === 0 || selectedAmenities.every(a => acc.amenities?.includes(a)))
    );

    filtered.sort((a, b) => sortBy === "price-low" ? a.price - b.price :
                  sortBy === "price-high" ? b.price - a.price : 
                  a.name.localeCompare(b.name));

    setFilteredAccommodations(filtered);
  };

  const removeFilter = (type, value) => {
    switch(type) {
      case 'destination':
        setSelectedDestinations(prev => prev.filter(d => d !== value));
        break;
      case 'amenity':
        setSelectedAmenities(prev => prev.filter(a => a !== value));
        break;
      case 'sort':
        setSortBy('name');
        break;
      case 'price':
        setPriceRange([0, 10000]);
        break;
      default:
        break;
    }
  };

  const gradientText = {
    background: 'linear-gradient(45deg, #f57f17 30%, #ffca28 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    letterSpacing: '-0.5px'
  };

  return (
    <Box sx={{ pt: 8 }}>
      <Navbar />

      {/* Enhanced Search & Filters Section */}
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
  {/* Compact Hero Header for Mobile */}
  <Typography variant="h2" sx={{
    mb: { xs: 2, md: 4 },
    ...gradientText,
    fontSize: { xs: '1.75rem', md: '2.75rem' },
    px: 2
  }}>
    Explore Stays
  </Typography>

  {/* Sticky Search Bar */}
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
      placeholder="Search accommodations..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: <Search sx={{ 
          color: "text.secondary", 
          mr: 1,
          fontSize: { xs: '1.2rem', md: '1.5rem' }
        }} />,
        endAdornment: (
          <Button 
            variant="contained" 
            color="warning"
            sx={{ 
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              px: { xs: 1.5, md: 3 },
              minWidth: { xs: 'auto', md: '100px' },
              borderRadius: "0 8px 8px 0"
            }}
          >
            {useMediaQuery(theme.breakpoints.up('md')) ? 'Search' : <Search />}
          </Button>
        ),
        sx: {
          borderRadius: "8px",
          bgcolor: "background.default",
          boxShadow: { xs: 1, md: 3 },
          pr: { xs: 8, md: 10 },
          height: { xs: '48px', md: '56px' },
          '& input': {
            fontSize: { xs: '0.9rem', md: '1rem' }
          }
        }
      }}
    />
  </Box>

  {/* Compact Filter Chips for Mobile */}
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
      onClick={() => setIsFilterModalOpen(true)}
      icon={<Tune fontSize="small" />}
      variant="outlined"
      sx={{
        borderColor: 'grey.300',
        bgcolor: 'background.paper',
        '&:hover': { bgcolor: 'warning.light' },
        flexShrink: 0
      }}
    />
    {sortBy !== 'name' && (
      <Chip
        label={`Sort: ${sortBy === 'price-low' ? 'Low' : 'High'}`}
        onDelete={() => removeFilter('sort')}
        sx={{
          bgcolor: 'warning.light',
          '.MuiChip-deleteIcon': { color: 'warning.dark' },
          flexShrink: 0
        }}
      />
    )}
    {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
      <Chip
        label={`₹${priceRange[0]}-${priceRange[1]}`}
        onDelete={() => removeFilter('price')}
        sx={{
          bgcolor: 'warning.light',
          '.MuiChip-deleteIcon': { color: 'warning.dark' },
          flexShrink: 0
        }}
      />
    )}
    {selectedDestinations.map(destination => (
      <Chip
        key={destination}
        label={destination}
        onDelete={() => removeFilter('destination', destination)}
        sx={{
          bgcolor: 'warning.light',
          '.MuiChip-deleteIcon': { color: 'warning.dark' },
          flexShrink: 0
        }}
      />
    ))}
    {selectedAmenities.map(amenity => (
      <Chip
        key={amenity}
        label={amenity}
        onDelete={() => removeFilter('amenity', amenity)}
        sx={{
          bgcolor: 'warning.light',
          '.MuiChip-deleteIcon': { color: 'warning.dark' },
          flexShrink: 0
        }}
      />
    ))}
  </Box>
</Box>

{/* Results Header */}
<Box sx={{ 
  textAlign: "center",
  py: 2,
  bgcolor: "background.paper",
  borderBottom: "1px solid",
  borderTop: "1px solid",
  borderColor: "divider",
  transition: 'all 0.3s ease',
  mx: { xs: -2, md: 0 },
  px: 2
}}>
  <Typography variant="h5" sx={{ 
    ...gradientText,
    fontSize: { xs: '1rem', md: '1.5rem' },
    fontWeight: 900,
    letterSpacing: '-0.05rem',
    lineHeight: 1.3,
    px: 2
  }}>
    {filteredAccommodations.length} {filteredAccommodations.length === 1 ? 'Accommodation' : 'Accommodations'} Found
  </Typography>
</Box>

      {/* Accommodations Grid */}
      <Box sx={{ 
        p: { xs: 2, md: 4 },
        maxWidth: 1400,
        mx: "auto"
      }}>
        <Grid container spacing={3}>
          {filteredAccommodations.map(acc => (
            <Grid item key={acc._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                component={motion.div}
                whileHover={{ y: -4 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  transition: "all 0.2s ease",
                  '&:hover': {
                    boxShadow: "0 4px 6px rgba(0,0,0,0.16)"
                  }
                }}
              >
                <Box sx={{ 
                  position: "relative",
                  pt: "56.25%",
                  overflow: "hidden"
                }}>
                  <CardMedia
                    component="img"
                    image={acc.images?.[0] || "/images/placeholder-accom.png"}
                    alt={acc.name}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <Chip
                    label={`₹${acc.price}/night`}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      bgcolor: "#e8f5e9",
                      color: "#2e7d32",
                      fontWeight: 600
                    }}
                  />
                </Box>

                <CardContent sx={{ 
                  flexGrow: 1,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: "#212121",
                    lineHeight: 1.2
                  }}>
                    {acc.name}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: "#616161",
                    mb: 1
                  }}>
                    {acc.destination}
                  </Typography>

                  <Box sx={{ 
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    mt: "auto"
                  }}>
                    <Chip
                      label={`🛏️ ${acc.roomType}`}
                      size="small"
                      sx={{ bgcolor: "#f5f5f5", color: "#616161" }}
                    />
                    <Chip
                      label={`👥 ${acc.maxOccupancy} guests`}
                      size="small"
                      sx={{ bgcolor: "#f5f5f5", color: "#616161" }}
                    />
                  </Box>
                </CardContent>

                <Button
                  fullWidth
                  component={Link}
                  to={`/accommodations/${acc._id}`}
                  sx={{
                    bgcolor: "#e8f5e9",
                    color: "#2e7d32",
                    borderRadius: 0,
                    py: 1,
                    '&:hover': {
                      bgcolor: "#c8e6c9"
                    }
                  }}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredAccommodations.length === 0 && (
          <Box sx={{ 
            textAlign: "center", 
            py: 8,
            color: "#9e9e9e"
          }}>
            <Search sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No accommodations found
            </Typography>
            <Typography variant="body1">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </Box>

      {/* Filter Modal */}
      <Dialog
        fullScreen={isMobile}
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : '12px' } }}
      >
        <DialogTitle sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1
        }}>
          Filter Options
          <IconButton onClick={() => setIsFilterModalOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          p: 0
        }}>
          {/* Filter Categories */}
          <List sx={{ 
            width: { md: 240 },
            borderRight: { md: "1px solid #e0e0e0" }
          }}>
            {['Sort', 'Price', 'Destinations', 'Amenities'].map((category) => (
              <ListItemButton
                key={category}
                selected={activeFilterCategory === category.toLowerCase()}
                onClick={() => setActiveFilterCategory(category.toLowerCase())}
                sx={{
                  borderLeft: "4px solid",
                  borderColor: activeFilterCategory === category.toLowerCase() ? 
                    "#4caf50" : "transparent",
                  bgcolor: activeFilterCategory === category.toLowerCase() ? 
                    "#e8f5e9" : "transparent"
                }}
              >
                <ListItemText 
                  primary={category} 
                  primaryTypographyProps={{
                    fontWeight: activeFilterCategory === category.toLowerCase() ? 600 : 400
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          {/* Filter Content */}
          <Box sx={{ 
            flex: 1,
            p: 3,
            overflowY: "auto",
            maxHeight: { md: "60vh" }
          }}>
            {activeFilterCategory === "sort" && (
              <RadioGroup value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <FormControlLabel 
                  value="name" 
                  control={<Radio color="success" />} 
                  label="Alphabetical (A-Z)" 
                />
                <FormControlLabel 
                  value="price-low" 
                  control={<Radio color="success" />} 
                  label="Price: Low to High" 
                />
                <FormControlLabel 
                  value="price-high" 
                  control={<Radio color="success" />} 
                  label="Price: High to Low" 
                />
              </RadioGroup>
            )}

            {activeFilterCategory === "price" && (
              <Box sx={{ px: 2 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue)}
                  min={0}
                  max={10000}
                  step={500}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                  color="success"
                />
              </Box>
            )}

            {activeFilterCategory === "destinations" && (
              <Box sx={{ columnCount: { md: 2 }, columnGap: 4 }}>
                {allDestinations.map((destination) => (
                  <FormControlLabel
                    key={destination}
                    control={
                      <Checkbox
                        checked={selectedDestinations.includes(destination)}
                        onChange={(e) => setSelectedDestinations(
                          e.target.checked ? [...selectedDestinations, destination] :
                          selectedDestinations.filter(d => d !== destination)
                )}
                        color="success"
                      />
                    }
                    label={destination}
                    sx={{ display: "block", mb: 1 }}
                  />
                ))}
              </Box>
            )}

            {activeFilterCategory === "amenities" && (
              <Box sx={{ columnCount: { md: 2 }, columnGap: 4 }}>
                {allAmenities.map((amenity) => (
                  <FormControlLabel
                    key={amenity}
                    control={
                      <Checkbox
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => setSelectedAmenities(
                          e.target.checked ? [...selectedAmenities, amenity] :
                          selectedAmenities.filter(a => a !== amenity)
                        )}
                        color="success"
                      />
                    }
                    label={amenity}
                    sx={{ display: "block", mb: 1 }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ 
              position: "sticky",
              bottom: 0,
              bgcolor: "background.paper",
              pt: 2,
              borderTop: "1px solid #e0e0e0",
              mt: 3
            }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => setIsFilterModalOpen(false)}
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Accommodations;