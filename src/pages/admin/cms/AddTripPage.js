// --- START OF FILE src/pages/admin/cms/AddTripPage.js ---
import React, { useState } from "react";
import { Container, Typography, Chip, TextField, Button, Box, CircularProgress, Autocomplete, Grid } from "@mui/material";
import Navbar from "../../../components/common/Navbar";
import Navbar2 from "../../../components/common/Navbar2";
import Footer from "../../../components/common/Footer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from 'react-router-dom';
import ItineraryDayForm from "./ItineraryDayForm"; // Import ItineraryDayForm

// Define options for Autocomplete components
const themeOptions = ["Adventure", "Beach", "City Break", "Cultural", "Family", "Hiking", "Luxury", "Nature", "Romantic", "Wildlife"];
const inclusionOptions = ["Accommodation", "Flights", "Meals", "Sightseeing Tours", "Transportation", "Activities", "Entrance Fees", "Guide Services"];
const exclusionOptions = ["Personal Expenses", "Visa Fees", "Insurance", "Optional Activities", "Souvenirs", "Tips/Gratuities"];

const AddTripPage = ({ isMobile }) => {
  // State for form data (itineraries is now an array of objects)
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
    category: "",
    theme: "",
    tripExpert: "",
    // images should be array if using multiple images
    images: [], 
    itineraries: [{ highlights: [] }], // Initialize with first day's object    availibility: false,
  });
  const [loading, setLoading] = useState(false);
  const [itenaryDays, setItenaryDays] = useState([0]); // State to manage number of itinerary days - start with 1 day (index 0)
  const navigate = useNavigate();

  // Add authentication token handling
  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleChange = (e, newValue) => { // Updated handleChange for Autocomplete and TextField
    const { name } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: newValue !== undefined ? newValue : e.target.value
    }));
  };

  const handleChangeDayData = (dayIndex, updatedDayData) => {
    const updatedItineraries = [...formData.itineraries];
    updatedItineraries[dayIndex] = updatedDayData;
    setFormData(prevData => ({ ...prevData, itineraries: updatedItineraries }));
  };

  const handleAddHighlight = (dayIndex, highlightText) => {
    console.log("handleAddHighlight called for dayIndex:", dayIndex, "highlightText:", highlightText);
  
    // More defensive and explicit state update for immutability
    const updatedItineraries = formData.itineraries.map((dayItinerary, index) => { // Map over itineraries array to create a NEW array
      if (index === dayIndex) { // If it's the day we are updating
        return {
          ...dayItinerary, // Copy existing properties of the day itinerary
          highlights: [...(dayItinerary.highlights || []), highlightText] // Update highlights array - still create a new array for highlights
        };
      } else {
        return dayItinerary; // Return unchanged day itinerary for other days
      }
    });
  
    console.log("Updated formData.itineraries (after setFormData):", updatedItineraries);
  
    setFormData(prevData => ({ ...prevData, itineraries: updatedItineraries })); // Update formData state with the NEW updatedItineraries array
  };

  const handleAddInclusion = (dayIndex, inclusionText) => {
    const updatedItineraries = [...formData.itineraries];
    const currentDayItinerary = updatedItineraries[dayIndex] || {};
    const updatedInclusions = [...(currentDayItinerary.inclusions || []), inclusionText];
    updatedItineraries[dayIndex] = { ...currentDayItinerary, inclusions: updatedInclusions };
    setFormData(prevData => ({ ...prevData, itineraries: updatedItineraries }));
  };

  const handleAddExclusion = (dayIndex, exclusionText) => {
    const updatedItineraries = [...formData.itineraries];
    const currentDayItinerary = updatedItineraries[dayIndex] || {};
    const updatedExclusions = [...(currentDayItinerary.exclusions || []), exclusionText];
    updatedItineraries[dayIndex] = { ...currentDayItinerary, exclusions: updatedExclusions };
    setFormData(prevData => ({ ...prevData, itineraries: updatedItineraries }));
  };

  const handleDeleteDay = (dayIndex) => {
    const updatedItineraries = formData.itineraries.filter((_, index) => index !== dayIndex);
    setFormData(prevData => ({ ...prevData, itineraries: updatedItineraries }));
    setItenaryDays(prevDays => prevDays.filter((day, index) => index !== dayIndex))
  };


  const handleAddDay = () => {
    setItenaryDays(prevDays => [...prevDays, prevDays.length]);
    setFormData(prevData => ({
      ...prevData,
      itineraries: [...prevData.itineraries, { highlights: [] }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tripDataToSubmit = {
        ...formData,
        themes: formData.themes,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        images: formData.images,
        itineraries: formData.itineraries,
        price: parseInt(formData.price),
        daysCount: parseInt(formData.daysCount),
        nightsCount: parseInt(formData.nightsCount),
        availability: formData.availability === 'true',
      };

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader() // Add authentication header
        },
        body: JSON.stringify(tripDataToSubmit),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Trip added successfully:", responseData);
      alert("Trip package added successfully!");
      navigate(`/trips/${responseData.tripId}`);
      
    } catch (error) {
      console.error("Error adding trip:", error);
      alert(error.message || "Error adding trip package. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const renderItenaryDays = () => {
    return itenaryDays.map((dayIndex) => (
      <ItineraryDayForm
        key={dayIndex}
        dayIndex={dayIndex}
        dayData={formData.itineraries[dayIndex] || {}}
        onChangeDayData={handleChangeDayData}
        onAddHighlight={handleAddHighlight}
        onAddInclusion={handleAddInclusion}
        onAddExclusion={handleAddExclusion}
        onDeleteDay={handleDeleteDay}
      />
    ));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px", textAlign: "center" }}>
          <Typography variant="h6">Adding Trip Package...</Typography>
          <CircularProgress />
        </Container>
        <Footer />
        {isMobile && <Navbar2 />}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Add New Trip Package
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField label="Trip Name" name="name" value={formData.name} onChange={handleChange} fullWidth variant="outlined" required />
          <TextField label="Destination" name="destination" value={formData.destination} onChange={handleChange} fullWidth variant="outlined" />
          <TextField label="Description" name="desc" multiline rows={4} value={formData.desc} onChange={handleChange} fullWidth variant="outlined" />
          <TextField label="Price (per person)" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth variant="outlined" />
          <TextField label="Days Count" name="daysCount" type="number" value={formData.daysCount} onChange={handleChange} fullWidth variant="outlined" />
          <TextField label="Nights Count" name="nightsCount" type="number" value={formData.nightsCount} onChange={handleChange} fullWidth variant="outlined" />
          <Autocomplete
            multiple
            options={themeOptions}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Themes" variant="outlined" />}
            value={formData.themes}
            onChange={(event, newValue) => handleChange({ target: { name: 'themes', value: newValue } }, newValue)}
            fullWidth
            name="themes"
            // ADDED renderTags prop for displaying selected chips/tags
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
              ))
            }
          />
                   <Autocomplete
            multiple
            options={inclusionOptions}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Inclusions" variant="outlined" multiline rows={2} />}
            value={formData.inclusions}
            onChange={(event, newValue) => handleChange({ target: { name: 'inclusions', value: newValue } }, newValue)}
            fullWidth
            name="inclusions"
            // ADDED renderTags prop for displaying selected chips/tags - for Inclusions Autocomplete
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
              ))
            }
          />
                   <Autocomplete
            multiple
            options={exclusionOptions}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Exclusions" variant="outlined" multiline rows={2} />}
            value={formData.exclusions}
            onChange={(event, newValue) => handleChange({ target: { name: 'exclusions', value: newValue } }, newValue)}
            fullWidth
            name="exclusions"
            // ADDED renderTags prop for displaying selected chips/tags - for Exclusions Autocomplete
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
              ))
            }
          />
          <TextField label="Highlights (comma-separated)" name="highlights" multiline rows={2} value={formData.highlights} onChange={handleChange} fullWidth variant="outlined" />
          <TextField
            label="Image URLs (comma-separated)" // Basic text field for image URLs for now
            name="images"
            multiline
            rows={3}
            value={formData.images.join(',')} // Convert array to string
            onChange={(e) => setFormData(prev => ({
              ...prev,
              images: e.target.value.split(',')
            }))}
            fullWidth
            variant="outlined"
          />

          
          {/* Replaced Itineraries (JSON String) TextField with dynamic ItineraryDayForms */}
          <Typography
            component="div"
            variant="subtitle1"
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            Itinerary
          </Typography>
          {renderItenaryDays()}
          <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleAddDay}>
            Add another day
          </Button>

          <Button type="submit" variant="contained" color="primary" fullWidth>
  Publish Trip 
</Button>
        </Box>
      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default AddTripPage;
// --- END OF FILE src/pages/admin/cms/AddTripPage.js ---