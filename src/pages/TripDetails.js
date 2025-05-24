// Replace the existing TripDetails component with this
import React, { useEffect, useState } from "react";
import ImageGallery from "../components/TripDetails/ImageGallery";
import { useParams } from "react-router-dom";
import { Box, Container, Grid, Typography } from "@mui/material";
import TripInfo from "../components/TripDetails/TripInfo";
import BookNow from "../components/TripDetails/BookNow";
import StickyTripTitle from "../components/TripDetails/StickyTripTitle";
import { getAllTrips } from "../endpoints";

const TripDetails = ({ isMobile }) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`${getAllTrips}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        alert("Error loading trip details. Check console.");
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h6" align="center">
          Loading trip details...
        </Typography>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h6" align="center" color="error">
          Trip not found
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ width: { sm: "400px", xs: "100%", pt:15 }, margin: "0px auto" }}>
        <StickyTripTitle trip={trip} />
      </Box>
      <Container maxWidth="lg" sx={{ mt: "100px", pb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ImageGallery images={trip.images} />
          </Grid>
          <Grid item xs={12} md={8}>
            <TripInfo trip={trip} />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookNow trip={trip} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TripDetails;
