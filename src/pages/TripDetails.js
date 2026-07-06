// src/pages/TripDetails.js
import React, { useCallback, useEffect, useState } from "react";
import ImageGallery from "../components/TripDetails/ImageGallery";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Grid, Skeleton, Typography } from "@mui/material";
import TripInfo from "../components/TripDetails/TripInfo";
import BookNow from "../components/TripDetails/BookNow";
import StickyTripTitle from "../components/TripDetails/StickyTripTitle";
import { getAllTrips } from "../endpoints";
import { useNotification } from "../context/NotificationContext";

const TripDetails = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const { notify } = useNotification();

  const fetchTrip = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${getAllTrips}/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTrip(data);
    } catch (err) {
      setError(true);
      notify("Couldn't load trip details. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, notify]);

  useEffect(() => {
    fetchTrip();
    window.scrollTo(0, 0);
  }, [fetchTrip]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 14, pb: 4 }}>
        <Skeleton variant="rounded" height={360} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={48} width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rounded" height={220} sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={420} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !trip) {
    return (
      <Container maxWidth="lg" sx={{ pt: 16, pb: 8, textAlign: "center" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {error ? "We couldn't load this trip." : "Trip not found"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {error
            ? "Something went wrong on our end. Please try again."
            : "This trip may have been removed or the link is incorrect."}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {error && (
            <Button variant="contained" color="primary" onClick={fetchTrip}>
              Try Again
            </Button>
          )}
          <Button variant="outlined" color="primary" component={RouterLink} to="/trips">
            Browse All Trips
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Box sx={{ width: { sm: "400px", xs: "100%" }, pt: 15, margin: "0px auto" }}>
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
