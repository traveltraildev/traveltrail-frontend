import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  InputAdornment,
  Container,
  Paper,
  Box,
  Stack,
  Divider,
  Alert,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  useTheme,
} from "@mui/material";
import { getAllAccommodations } from "../../../endpoints";
import { useAuth } from '@clerk/clerk-react';
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const EditAccommodation = () => {
  const { getToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState(null);
  const [lastSavedAccommodationId, setLastSavedAccommodationId] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchAccommodation = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch(`${getAllAccommodations}/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch accommodation data.");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        setNotification({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id, getToken]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication required");

      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        baseOccupancy: Number(formData.baseOccupancy),
        extraAdultFee: Number(formData.extraAdultFee),
        extraChildFee: Number(formData.extraChildFee),
        maxOccupancy: Number(formData.maxOccupancy),
        images: Array.isArray(formData.images) ? formData.images.filter((url) => url.trim() !== "") : [],
        themes: Array.isArray(formData.themes) ? formData.themes.filter((theme) => theme.trim() !== "") : [],
        amenities: Array.isArray(formData.amenities) ? formData.amenities.filter((amenity) => amenity.trim() !== "") : [],
        inclusions: Array.isArray(formData.inclusions) ? formData.inclusions.filter((incl) => incl.trim() !== "") : [],
        exclusions: Array.isArray(formData.exclusions) ? formData.exclusions.filter((excl) => excl.trim() !== "") : [],
      };

      const response = await fetch(`${getAllAccommodations}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        navigate("/sign-in");
        return;
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      const updatedId = responseData.accommodationId || responseData._id || responseData.id || id;
  setLastSavedAccommodationId(updatedId || id);
  setNotification({ type: 'success', message: 'Accommodation updated successfully!' });
  // Scroll to top so admin can see notifications on long forms
  window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: theme.shadows[4] }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Edit Accommodation</Typography>
              <Typography color="text.secondary">Update the details for the accommodation.</Typography>
            </Box>

            {notification.message && 
              <Alert severity={notification.type} sx={{ width: '100%' }}>
                {notification.message}
              </Alert>
            }

            {formData && (
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={4} divider={<Divider />}>
                  <Box>
                    <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Basic Information</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Accommodation Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Destination" value={formData.destination} onChange={(e) => handleChange("destination", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Base Price per Night" type="number" value={formData.basePrice} onChange={(e) => handleChange("basePrice", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Base Occupancy" type="number" value={formData.baseOccupancy} onChange={(e) => handleChange("baseOccupancy", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Extra Adult Fee" type="number" value={formData.extraAdultFee} onChange={(e) => handleChange("extraAdultFee", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Extra Child Fee" type="number" value={formData.extraChildFee} onChange={(e) => handleChange("extraChildFee", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} required />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Room Type" value={formData.roomType} onChange={(e) => handleChange("roomType", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField fullWidth label="Bed Type" value={formData.bedType} onChange={(e) => handleChange("bedType", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField fullWidth label="Max Occupancy" type="number" value={formData.maxOccupancy} onChange={(e) => handleChange("maxOccupancy", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField fullWidth label="Room Size" value={formData.size} onChange={(e) => handleChange("size", e.target.value)} required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Overview" multiline rows={4} value={formData.overview} onChange={(e) => handleChange("overview", e.target.value)} required />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>Details & Features</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Autocomplete multiple freeSolo options={[]} value={formData.images} onChange={(event, newValue) => handleChange("images", newValue)} renderInput={(params) => <TextField {...params} label="Image URLs" placeholder="Enter image URLs and press Enter" />} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete multiple freeSolo options={[]} value={formData.themes} onChange={(event, newValue) => handleChange("themes", newValue)} renderInput={(params) => <TextField {...params} label="Themes" placeholder="Enter themes and press Enter" />} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete multiple freeSolo options={[]} value={formData.amenities} onChange={(event, newValue) => handleChange("amenities", newValue)} renderInput={(params) => <TextField {...params} label="Amenities" placeholder="Enter amenities and press Enter" />} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete multiple freeSolo options={[]} value={formData.inclusions} onChange={(event, newValue) => handleChange("inclusions", newValue)} renderInput={(params) => <TextField {...params} label="Inclusions" placeholder="Enter inclusions and press Enter" />} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete multiple freeSolo options={[]} value={formData.exclusions} onChange={(event, newValue) => handleChange("exclusions", newValue)} renderInput={(params) => <TextField {...params} label="Exclusions" placeholder="Enter exclusions and press Enter" />} />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox checked={formData.isFeatured || false} onChange={(e) => handleChange("isFeatured", e.target.checked)} />} label="Feature this accommodation on homepage?" />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                    {lastSavedAccommodationId && (
                      <Button variant="contained" color="secondary" onClick={() => window.open(`/accommodations/${lastSavedAccommodationId}`, '_blank')}>
                        View Accommodation
                      </Button>
                    )}
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

export default EditAccommodation;