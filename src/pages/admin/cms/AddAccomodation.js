// Replace the existing AddAccommodation component with this
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Card,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { getAllAccommodations } from "../../../endpoints";

const AddAccommodation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    roomType: "",
    bedType: "",
    maxOccupancy: "",
    size: "",
    overview: "",
    images: [],
    themes: [],
    amenities: [],
    inclusions: [],
    exclusions: [],
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "price" || field === "maxOccupancy" ? Number(value) : value,
    }));
  };

  const handleArrayChange = (field) => (e) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Authentication required");

      const payload = {
        ...formData,
        price: Number(formData.price),
        maxOccupancy: Number(formData.maxOccupancy),
        images: formData.images.filter((url) => url.trim() !== ""),
        themes: formData.themes.filter((theme) => theme.trim() !== ""),
        amenities: formData.amenities.filter(
          (amenity) => amenity.trim() !== ""
        ),
        inclusions: formData.inclusions.filter((incl) => incl.trim() !== ""),
        exclusions: formData.exclusions.filter((excl) => excl.trim() !== ""),
      };

      const response = await fetch(getAllAccommodations, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Submission failed");
      }

      navigate("/admin/accommodations");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4, mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Add New Accommodation
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Accommodation Name"
              value={formData.name}
              onChange={handleChange("name")}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Price per Night"
              type="number"
              value={formData.price}
              onChange={handleChange("price")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Room Type"
              value={formData.roomType}
              onChange={handleChange("roomType")}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Bed Type"
              value={formData.bedType}
              onChange={handleChange("bedType")}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Occupancy"
              type="number"
              value={formData.maxOccupancy}
              onChange={handleChange("maxOccupancy")}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Room Size"
              value={formData.size}
              onChange={handleChange("size")}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URLs (comma separated)"
              value={formData.images.join(", ")}
              onChange={handleArrayChange("images")}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Overview"
              multiline
              rows={4}
              value={formData.overview}
              onChange={handleChange("overview")}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Themes (comma separated)"
              value={formData.themes.join(", ")}
              onChange={handleArrayChange("themes")}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Amenities (comma separated)"
              value={formData.amenities.join(", ")}
              onChange={handleArrayChange("amenities")}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Inclusions (comma separated)"
              value={formData.inclusions.join(", ")}
              onChange={handleArrayChange("inclusions")}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Exclusions (comma separated)"
              value={formData.exclusions.join(", ")}
              onChange={handleArrayChange("exclusions")}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#115293" },
              }}
            >
              {loading ? "Submitting..." : "Add Accommodation"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default AddAccommodation;
