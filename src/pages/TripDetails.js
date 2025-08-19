import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  AppBar,
  Toolbar,
  Button,
  Slide,
  useScrollTrigger,
  Stack
} from "@mui/material";
import ImageGallery from "../components/TripDetails/ImageGallery";
import TripInfo from "../components/TripDetails/TripInfo";
import BookNow from "../components/TripDetails/BookNow";
import { getAllTrips } from "../endpoints";

// A new sticky header that appears on scroll
const StickyHeader = ({ trip }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400, // Appears after scrolling 400px
  });

  return (
    <Slide appear={false} direction="down" in={trigger}>
      <AppBar component="div" elevation={2} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="text.primary" fontWeight="600">{trip.name}</Typography>
            <Typography variant="body2" color="text.secondary">{trip.daysCount} Days / {trip.nightsCount} Nights</Typography>
          </Box>
          <Button variant="contained" href="#booking-section">Book Now</Button>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

const TripDetails = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    fetch(`${getAllTrips}/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setTrip(data))
      .catch((error) => console.error("Error fetching trip details:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: 2, mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container sx={{ textAlign: 'center', py: 12 }}>
        <Typography variant="h4">Trip not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <StickyHeader trip={trip} />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Left Column: Gallery and Info */}
          <Grid item xs={12} md={7} lg={8}>
            <Stack spacing={4}>
              <ImageGallery images={trip.images} />
              <TripInfo trip={trip} />
            </Stack>
          </Grid>

          {/* Right Column: Booking Form */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ position: 'sticky', top: 100 }} id="booking-section">
              <BookNow trip={trip} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TripDetails;