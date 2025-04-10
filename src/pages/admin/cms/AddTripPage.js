// --- START OF FILE src/pages/admin/cms/AddTripPage.js ---
import React, { useState } from "react";
import {
  Container,
  Typography,
  Chip,
  TextField,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
  Grid
} from "@mui/material";
import Navbar from "../../../components/common/Navbar";
import Navbar2 from "../../../components/common/Navbar2";
import Footer from "../../../components/common/Footer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from 'react-router-dom';
import ItineraryDayForm from "./ItineraryDayForm";

// Define options for Autocomplete components
const themeOptions = ["Adventure", "Beach", "City Break", "Cultural", "Family", "Hiking", "Luxury", "Nature", "Romantic", "Wildlife"];
const inclusionOptions = ["Accommodation", "Flights", "Meals", "Sightseeing Tours", "Transportation", "Activities", "Entrance Fees", "Guide Services"];
const exclusionOptions = ["Personal Expenses", "Visa Fees", "Insurance", "Optional Activities", "Souvenirs", "Tips/Gratuities"];

const AddTripPage = ({ isMobile }) => {
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
    itineraries: [{ highlights: [] }],
    availability: true
  });
  const [loading, setLoading] = useState(false);
  const [itenaryDays, setItenaryDays] = useState([0]);
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeDayData = (dayIndex, updatedDayData) => {
    const updatedItineraries = [...formData.itineraries];
    updatedItineraries[dayIndex] = updatedDayData;
    setFormData(prev => ({ ...prev, itineraries: updatedItineraries }));
  };

  const handleAddHighlight = (dayIndex, highlightText) => {
    const updatedItineraries = formData.itineraries.map((day, index) =>
      index === dayIndex
        ? { ...day, highlights: [...(day.highlights || []), highlightText] }
        : day
    );
    setFormData(prev => ({ ...prev, itineraries: updatedItineraries }));
  };

  const handleAddDay = () => {
    setItenaryDays(prev => [...prev, prev.length]);
    setFormData(prev => ({
      ...prev,
      itineraries: [...prev.itineraries, { highlights: [] }]
    }));
  };

  const handleRemoveDay = (dayIndex) => {
    setItenaryDays(prev => prev.filter((_, i) => i !== dayIndex));
    setFormData(prev => ({
      ...prev,
      itineraries: prev.itineraries.filter((_, i) => i !== dayIndex)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          daysCount: parseInt(formData.daysCount),
          nightsCount: parseInt(formData.nightsCount)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Trip added successfully!");
      navigate(`/admin/cms/trips-list`);
    } catch (error) {
      alert(`Error adding trip: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderItineraryDays = () => {
    return itenaryDays.map((dayIndex) => (
      <ItineraryDayForm
        key={dayIndex}
        dayIndex={dayIndex}
        dayData={formData.itineraries[dayIndex]}
        onChangeDayData={handleChangeDayData}
        onAddHighlight={handleAddHighlight}
        onRemove={handleRemoveDay}
      />
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Add New Trip Package
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Trip Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="desc"
                multiline
                rows={4}
                value={formData.desc}
                onChange={(e) => handleChange("desc", e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Days Count"
                name="daysCount"
                type="number"
                value={formData.daysCount}
                onChange={(e) => handleChange("daysCount", e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Nights Count"
                name="nightsCount"
                type="number"
                value={formData.nightsCount}
                onChange={(e) => handleChange("nightsCount", e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={themeOptions}
                value={formData.themes}
                onChange={(event, newValue) => handleChange("themes", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Themes"
                    placeholder="Select themes"
                    fullWidth
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={inclusionOptions}
                value={formData.inclusions}
                onChange={(event, newValue) => handleChange("inclusions", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Inclusions"
                    placeholder="Select inclusions"
                    fullWidth
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={exclusionOptions}
                value={formData.exclusions}
                onChange={(event, newValue) => handleChange("exclusions", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Exclusions"
                    placeholder="Select exclusions"
                    fullWidth
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Image URLs (comma-separated)"
                name="images"
                multiline
                rows={3}
                value={formData.images.join(", ")}
                onChange={(e) => 
                  handleChange("images", e.target.value.split(",").map(url => url.trim()))
                }
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Itinerary
              </Typography>
              {renderItineraryDays()}
              <Button
                variant="contained"
                onClick={handleAddDay}
                sx={{ mt: 2, mb: 4 }}
              >
                Add Another Day
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Publish Trip
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default AddTripPage;
// --- END OF FILE src/pages/admin/cms/AddTripPage.js ---