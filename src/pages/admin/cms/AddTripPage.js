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
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ItineraryDayForm from "./ItineraryDayForm";
import { getAllTrips } from "../../../endpoints";

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
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const navigate = useNavigate();

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
      const response = await fetch(getAllTrips, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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

      setNotification({ type: 'success', message: 'Trip added successfully!' });
      setFormData({
        name: "", destination: "", desc: "", price: "", daysCount: "", nightsCount: "",
        themes: [], inclusions: [], exclusions: [], images: [],
        itineraries: [{ dayTitle: "", shortDescription: "", description: "", highlights: [] }],
        availability: true, isInternational: false,
      });
      // Optionally navigate after a delay
      // setTimeout(() => navigate(`/admin/cms/trips-list`), 1500);
    } catch (error) {
      setNotification({ type: 'error', message: `Error adding trip: ${error.message}` });
      console.error("Error adding new trip package:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600">Add New Trip Package</Typography>
            <Typography color="text.secondary">Fill in the details to create a new travel package.</Typography>
          </Box>

          {notification.message && 
            <Alert severity={notification.type} sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          }

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Basic Details */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Basic Information</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField label="Trip Name" name="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} fullWidth required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Destination" name="destination" value={formData.destination} onChange={(e) => handleChange("destination", e.target.value)} fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Description" name="desc" multiline rows={4} value={formData.desc} onChange={(e) => handleChange("desc", e.target.value)} fullWidth />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Pricing & Duration */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Pricing & Duration</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField label="Price" name="price" type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} fullWidth required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="Days Count" name="daysCount" type="number" value={formData.daysCount} onChange={(e) => handleChange("daysCount", e.target.value)} fullWidth required />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="Nights Count" name="nightsCount" type="number" value={formData.nightsCount} onChange={(e) => handleChange("nightsCount", e.target.value)} fullWidth required />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Categorization & Media */}
              <Box>
                <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Categorization & Media</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Autocomplete multiple options={themeOptions} value={formData.themes} onChange={(event, newValue) => handleChange("themes", newValue)} renderInput={(params) => (<TextField {...params} label="Themes" placeholder="Select themes" fullWidth />)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete multiple options={inclusionOptions} value={formData.inclusions} onChange={(event, newValue) => handleChange("inclusions", newValue)} renderInput={(params) => (<TextField {...params} label="Inclusions" placeholder="Select inclusions" fullWidth />)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete multiple options={exclusionOptions} value={formData.exclusions} onChange={(event, newValue) => handleChange("exclusions", newValue)} renderInput={(params) => (<TextField {...params} label="Exclusions" placeholder="Select exclusions" fullWidth />)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Image URLs (comma-separated)" name="images" multiline rows={3} value={formData.images.join(", ")} onChange={(e) => handleChange("images", e.target.value.split(",").map((url) => url.trim()))} fullWidth helperText="Enter full image URLs separated by commas" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox checked={formData.isInternational} onChange={(e) => handleChange("isInternational", e.target.checked)} />} label="Is this an international trip?" />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

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

              <Divider />

              {/* Submit Button */}
              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={26} color="inherit" /> : "Publish Trip"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AddTripPage;