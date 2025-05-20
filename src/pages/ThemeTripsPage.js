// src/pages/ThemeTripsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TripsCard from "../components/TripsCard"; // Import your existing TripsCard component

const ThemeTripsPage = () => {
  const { themeName } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);

  useEffect(() => {
    const fetchThemeTrips = async () => {
      try {
        const encodedTheme = encodeURIComponent(themeName);
        const response = await fetch(
          `/api/trips/by-theme/${encodedTheme}?page=${page}&limit=${itemsPerPage}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        if (data.success) {
          setTrips(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/trips');
      }
    };
  
    fetchThemeTrips();
  }, [themeName, page]);

  return (
    <Box sx={{ p: "100px 7%", backgroundColor: "#f5f5f5" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            textTransform: "capitalize",
            mb: 2,
          }}
        >
          {themeName} Tripss
        </Typography>
        
        <Chip
          label={`Showing ${filteredTrips.length} trips`}
          variant="outlined"
          sx={{
            bgcolor: theme.palette.background.paper,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            fontSize: "1rem",
            py: 1,
          }}
        />
      </Box>

      {/* Reuse your existing TripsCard component with filtered trips */}
      <Grid container spacing={2} justifyContent="center">
        {filteredTrips.map((trip) => (
          <Grid item key={trip._id} xs={12} sm={6} md={4}>
            {/* Your existing TripCard component */}
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <img
                src={trip.images[0] || "/images/default-trip.jpg"}
                alt={trip.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                {trip.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {trip.destination}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" color="primary">
                  ₹{trip.price?.toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/trips/${trip._id}`)}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {filteredTrips.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No trips found for {themeName} theme
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/trips")}
          >
            Browse All Trips
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ThemeTripsPage;