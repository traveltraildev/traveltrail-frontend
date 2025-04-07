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
  Card,
  CardContent,
  Chip,
  Autocomplete,
} from "@mui/material";
import ItineraryDayForm from "./ItineraryDayForm";

// Options for Autocomplete components
const themeOptions = [
  "Adventure",
  "Beach",
  "Cultural",
  "Family",
  "Luxury",
  "Nature",
  "Romantic",
];
const inclusionOptions = [
  "Accommodation",
  "Meals",
  "Transportation",
  "Guided Tours",
  "Entrance Fees",
];
const exclusionOptions = [
  "Flights",
  "Insurance",
  "Personal Expenses",
  "Visa Fees",
];

const EditTripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) throw new Error("Failed to fetch trip");
        const data = await response.json();
        setTripData({
          ...data,
          // Convert image array to comma-separated string for text input
          images: data.images.join(", "),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (name, value) => {
    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItineraryChange = (dayIndex, updatedDay) => {
    const updatedItineraries = [...tripData.itineraries];
    updatedItineraries[dayIndex] = updatedDay;
    setTripData((prev) => ({
      ...prev,
      itineraries: updatedItineraries,
    }));
  };

  const handleAddHighlight = (dayIndex, highlightText) => {
    const updatedItineraries = [...tripData.itineraries];
    updatedItineraries[dayIndex].highlights = [
      ...updatedItineraries[dayIndex].highlights,
      highlightText,
    ];
    setTripData((prev) => ({
      ...prev,
      itineraries: updatedItineraries,
    }));
  };

  const handleRemoveHighlight = (dayIndex, highlightIndex) => {
    setTripData((prev) => {
      const updatedItineraries = [...prev.itineraries];
      const day = updatedItineraries[dayIndex];
      if (day && day.highlights) {
        day.highlights.splice(highlightIndex, 1); // Remove the highlight by index
      }
      return { ...prev, itineraries: updatedItineraries };
    });
  };

  const handleAddDay = () => {
    setTripData((prev) => ({
      ...prev,
      itineraries: [
        ...prev.itineraries,
        {
          dayTitle: "",
          description: "",
          highlights: [],
        },
      ],
    }));
  };

  const handleDeleteDay = (dayIndex) => {
    const updatedItineraries = tripData.itineraries.filter(
      (_, index) => index !== dayIndex
    );
    setTripData((prev) => ({
      ...prev,
      itineraries: updatedItineraries,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tripToUpdate = {
        ...tripData,
        price: Number(tripData.price),
        daysCount: Number(tripData.daysCount),
        nightsCount: Number(tripData.nightsCount),
        images: tripData.images.split(",").map((url) => url.trim()),
        availability: tripData.availability === "true",
      };

      // Remove MongoDB _id from the update data
      delete tripToUpdate._id;

      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(tripToUpdate),
      });

      if (!response.ok) throw new Error("Update failed");
      navigate("/admin/cms/trips-list");
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">Error: {error}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", marginTop: "50px" }}
      >
        Edit Trip: {tripData.name}
      </Typography>

      <Card elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trip Name"
                name="name"
                value={tripData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Destination"
                name="destination"
                value={tripData.destination}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="desc"
                value={tripData.desc}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Pricing and Duration */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={tripData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Days"
                name="daysCount"
                value={tripData.daysCount}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Nights"
                name="nightsCount"
                value={tripData.nightsCount}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Themes and Categories */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={themeOptions}
                value={tripData.themes}
                onChange={(e, newValue) =>
                  handleArrayChange("themes", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Themes"
                    placeholder="Select themes"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={inclusionOptions}
                value={tripData.inclusions}
                onChange={(e, newValue) =>
                  handleArrayChange("inclusions", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Inclusions"
                    placeholder="Select inclusions"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={exclusionOptions}
                value={tripData.exclusions}
                onChange={(e, newValue) =>
                  handleArrayChange("exclusions", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Exclusions"
                    placeholder="Select exclusions"
                  />
                )}
              />
            </Grid>

            {/* Images */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Image URLs (comma separated)"
                name="images"
                value={tripData.images}
                onChange={handleChange}
                helperText="Enter full image URLs separated by commas"
              />
            </Grid>

            {/* Itinerary Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Itinerary
              </Typography>
              {tripData.itineraries.map((day, index) => (
                <ItineraryDayForm
                  key={index}
                  dayIndex={index}
                  dayData={day}
                  onChangeDayData={handleItineraryChange}
                  onAddHighlight={handleAddHighlight}
                  onRemoveHighlight={handleRemoveHighlight}
                  onDeleteDay={handleDeleteDay}
                />
              ))}
              <Button variant="outlined" onClick={handleAddDay} sx={{ mt: 2 }}>
                Add Another Day
              </Button>
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default EditTripPage;
