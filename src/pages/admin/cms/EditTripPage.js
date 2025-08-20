import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import ItineraryDayForm from "./ItineraryDayForm";
import { getAllTrips } from "../../../endpoints";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

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

const EditTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const theme = useTheme();

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`${getAllTrips}/${tripId}`);
        if (!response.ok) throw new Error("Failed to fetch trip data");
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

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
      const response = await fetch(`${getAllTrips}/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          daysCount: parseInt(formData.daysCount),
          nightsCount: parseInt(formData.nightsCount),
          images: Array.isArray(formData.images) ? formData.images.filter(img => img.trim() !== '') : formData.images.split(",").map(url => url.trim()).filter(url => url !== ''),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setNotification({ type: 'success', message: 'Trip updated successfully!' });
      setTimeout(() => navigate(`/admin/trips`), 2000);
    } catch (error) {
      setNotification({ type: 'error', message: `Error updating trip: ${error.message}` });
      console.error("Error updating trip package:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <>
    <Navbar />
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: theme.shadows[4] }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Edit Trip</Typography>
            <Typography color="text.secondary">Update the details for the trip package.</Typography>
          </Box>

          {notification.message && 
            <Alert severity={notification.type} sx={{ width: '100%' }}>
              {notification.message}
            </Alert>
          }

          {formData && (
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
                      <TextField label="Image URLs (comma-separated)" name="images" multiline rows={3} value={Array.isArray(formData.images) ? formData.images.join(", ") : formData.images} onChange={(e) => handleChange("images", e.target.value)} helperText="Enter full image URLs separated by commas" />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={<Checkbox checked={formData.isInternational} onChange={(e) => handleChange("isInternational", e.target.checked)} />} label="Is this an international trip?" />
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
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5, px: 5 }}>
                    {loading ? <CircularProgress size={26} color="inherit" /> : "Save Changes"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
    <Footer />
    </>
  );
};

export default EditTripPage;