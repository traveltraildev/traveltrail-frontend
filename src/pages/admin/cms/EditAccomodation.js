import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
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

const EditAccomodation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch Accommodation

  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    fetch(`${getAllAccommodations}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAccommodation(data);
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        alert("Error loading trip details. Check console.");
      });
    window.scrollTo(0, 0);
  }, [id]);

  const [formData, setFormData] = useState({
    name: accommodation?.name || "",
    price: accommodation?.price || "",
    roomType: accommodation?.roomType || "",
    bedType: accommodation?.bedType || "",
    maxOccupancy: accommodation?.maxOccupancy || "",
    size: accommodation?.size || "",
    overview: accommodation?.overview || "",
    images: accommodation?.images || [],
    themes: accommodation?.themes || [],
    amenities: accommodation?.amenities || [],
    inclusions: accommodation?.inclusions || [],
    exclusions: accommodation?.exclusions || [],
    destination: accommodation?.destination || "",
  });

  useEffect(() => {
    if (accommodation) {
      setFormData({
        name: accommodation?.name || "",
        price: accommodation?.price || "",
        roomType: accommodation?.roomType || "",
        bedType: accommodation?.bedType || "",
        maxOccupancy: accommodation?.maxOccupancy || "",
        size: accommodation?.size || "",
        overview: accommodation?.overview || "",
        images: accommodation?.images || [],
        themes: accommodation?.themes || [],
        amenities: accommodation?.amenities || [],
        inclusions: accommodation?.inclusions || [],
        exclusions: accommodation?.exclusions || [],
        destination: accommodation?.destination || "",
      });
    }
  }, [accommodation]);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } catch (error) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } finally {
        setAuthChecked(true);
      }
    };

    verifyToken();
  }, [navigate]);

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

      // Convert array fields properly
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
        destination: formData.destination, // Added destination to payload
      };

      const response = await fetch(`${getAllAccommodations}/${id}`, {
        method: "Put",
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

  if (!authChecked) {
    return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  }

  return (
    <Card elevation={3} sx={{ p: 3, mb: 4 }}>
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Destination"
              value={formData.destination}
              onChange={handleChange("destination")}
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
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Submitting..." : "Edit Accommodation"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
};

export default EditAccomodation;
