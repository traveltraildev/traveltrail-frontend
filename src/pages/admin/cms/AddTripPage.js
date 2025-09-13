import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
  Grid,
  Checkbox,
  Paper,
  Stack,
  Divider,
  Alert,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ItineraryDayForm from "./ItineraryDayForm";
import { getAllTrips } from "../../../endpoints";
import { useAuth } from '@clerk/clerk-react';
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

// Define options for Autocomplete components
const themeOptions = [
  "Adventure", "Beach", "Weekend", "Cultural", "Group", "Trekking",
  "Luxury", "Nature", "Love", "Friends", "Wildlife", "Honeymoon", "Spritual",
];
const inclusionOptions = [
  "Accommodation", "Flights", "Meals", "Sightseeing Tours",
  "Transportation", "Activities", "Entrance Fees", "Guide Services",
];
const exclusionOptions = [
  "Personal Expenses", "Visa Fees", "Insurance", "Optional Activities",
  "Souvenirs", "Tips/Gratuities",
];

const AddTripPage = () => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    desc: "",
    price: "",
    daysCount: "",
    nightsCount: "",
    themes: [],
    inclusions: [],
    exclusions: [],
    images: [],
    itineraries: [{ dayTitle: "", shortDescription: "", description: "", highlights: [] }],
    availability: true,
    isInternational: false,
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [lastCreatedTripId, setLastCreatedTripId] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeItineraryDayData = (dayIndex, updatedDayData) => {
    const updatedItineraries = [...formData.itineraries];
    updatedItineraries[dayIndex] = updatedDayData;
    setFormData((prev) => ({ ...prev, itineraries: updatedItineraries }));
  };

  const handleAddHighlight = (dayIndex, highlightText) => {
    setFormData((prev) => {
      const updatedItineraries = [...prev.itineraries];
      const day = updatedItineraries[dayIndex];
      if (day) {
        day.highlights = [...(day.highlights || []), highlightText];
      }
      return { ...prev, itineraries: updatedItineraries };
    });
  };

  const handleRemoveHighlight = (dayIndex, highlightIndex) => {
    setFormData((prev) => {
      const updatedItineraries = [...prev.itineraries];
      const day = updatedItineraries[dayIndex];
      if (day && day.highlights) {
        day.highlights.splice(highlightIndex, 1);
      }
      return { ...prev, itineraries: updatedItineraries };
    });
  };

  const handleAddDay = () => {
    setFormData((prev) => ({
      ...prev,
      itineraries: [...prev.itineraries, { dayTitle: "", shortDescription: "", description: "", highlights: [] }],
    }));
  };

  const handleRemoveDay = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      itineraries: prev.itineraries.filter((_, i) => i !== dayIndex),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const token = await getToken();
      const response = await fetch(getAllTrips, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          daysCount: parseInt(formData.daysCount),
          nightsCount: parseInt(formData.nightsCount),
          images: formData.images.filter(img => img.trim() !== ''), // Clean up empty image strings
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const newTripId = responseData.tripId || responseData.insertedId || responseData._id;

  setNotification({ type: 'success', message: 'Trip added successfully!' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
      setFormData({
        name: "", destination: "", desc: "", price: "", daysCount: "", nightsCount: "",
        themes: [], inclusions: [], exclusions: [], images: [],
        itineraries: [{ dayTitle: "", shortDescription: "", description: "", highlights: [] }],
        availability: true, isInternational: false,
      });
      // Offer to open the newly created trip in a new tab
      if (newTripId) {
        setNotification({ type: 'success', message: 'Trip added successfully! Click "View Trip" to open it.' });
        // store newTripId locally to allow viewing without leaving page
        setLastCreatedTripId(newTripId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: `Error adding trip: ${error.message}` });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error("Error adding new trip package:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: theme.shadows[4] }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Add New Trip</Typography>
            <Typography color="text.secondary">Create a new travel package with all the details.</Typography>
          </Box>

          {notification.message && 
            <Alert severity={notification.type} sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          }

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4} divider={<Divider />}>
              {/* Basic Details */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Basic Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField label="Trip Name" name="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Destination" name="destination" value={formData.destination} onChange={(e) => handleChange("destination", e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Description" name="desc" multiline rows={4} value={formData.desc} onChange={(e) => handleChange("desc", e.target.value)} />
                  </Grid>
                </Grid>
              </Box>

              {/* Pricing & Duration */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Pricing & Duration</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField label="Price" name="price" type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="Days Count" name="daysCount" type="number" value={formData.daysCount} onChange={(e) => handleChange("daysCount", e.target.value)} required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="Nights Count" name="nightsCount" type="number" value={formData.nightsCount} onChange={(e) => handleChange("nightsCount", e.target.value)} required />
                  </Grid>
                </Grid>
              </Box>

              {/* Categorization & Media */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Categorization & Media</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Autocomplete multiple options={themeOptions} value={formData.themes} onChange={(event, newValue) => handleChange("themes", newValue)} renderInput={(params) => (<TextField {...params} label="Themes" placeholder="Select themes" />)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete multiple options={inclusionOptions} value={formData.inclusions} onChange={(event, newValue) => handleChange("inclusions", newValue)} renderInput={(params) => (<TextField {...params} label="Inclusions" placeholder="Select inclusions" />)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete multiple options={exclusionOptions} value={formData.exclusions} onChange={(event, newValue) => handleChange("exclusions", newValue)} renderInput={(params) => (<TextField {...params} label="Exclusions" placeholder="Select exclusions" />)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Image URLs (comma-separated)" name="images" multiline rows={3} value={formData.images.join(", ")} onChange={(e) => handleChange("images", e.target.value.split(",").map((url) => url.trim()))} helperText="Enter full image URLs separated by commas" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox checked={formData.isInternational} onChange={(e) => handleChange("isInternational", e.target.checked)} />} label="Is this an international trip?" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox checked={formData.isFeatured} onChange={(e) => handleChange("isFeatured", e.target.checked)} />} label="Feature this trip on homepage?" />
                  </Grid>
                </Grid>
              </Box>

              {/* Itinerary */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Daily Itinerary</Typography>
                <Stack spacing={3}>
                  {formData.itineraries.map((dayData, index) => (
                    <ItineraryDayForm
                      key={index}
                      dayIndex={index}
                      dayData={dayData}
                      onChangeDayData={handleChangeItineraryDayData}
                      onAddHighlight={handleAddHighlight}
                      onRemoveHighlight={handleRemoveHighlight}
                      onDeleteDay={handleRemoveDay}
                    />
                  ))}
                </Stack>
                <Button variant="outlined" onClick={handleAddDay} sx={{ mt: 3 }} startIcon={<AddCircleOutline />}>Add Another Day</Button>
              </Box>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {lastCreatedTripId && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => window.open(`/trips/${lastCreatedTripId}`, '_blank')}
                  >
                    View Trip
                  </Button>
                )}
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, px: 5 }}>
                  {loading ? <CircularProgress size={26} color="inherit" /> : "Publish Trip"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
    <Footer />
    </>
  );
};

export default AddTripPage;
