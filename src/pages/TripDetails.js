import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  Button,
  Slide,
  useScrollTrigger,
  Stack,
  useTheme,
  Link,
  Paper
} from "@mui/material";
import ImageGallery from "../components/TripDetails/ImageGallery";
import TripInfo from "../components/TripDetails/TripInfo";
import BookNow from "../components/TripDetails/BookNow";
import { getAllTrips } from "../endpoints";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const StickyHeader = ({ trip }) => {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 500, // Appears after scrolling 500px
  });

  return (
    <Slide appear={false} direction="down" in={trigger}>
      <Paper 
        elevation={6} 
        sx={{ 
          position: 'fixed', 
          top: '80px', 
          left: 0, 
          right: 0, 
          zIndex: 1100, 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', 
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 1.5,
          px: {xs: 2, md: 3}
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" color="text.primary" fontWeight="600" noWrap>{trip.name}</Typography>
              <Typography variant="body2" color="text.secondary">{trip.daysCount} Days / {trip.nightsCount} Nights</Typography>
            </Box>
            <Button variant="contained" href="#booking-section" size="small">Book Now</Button>
          </Box>
        </Container>
      </Paper>
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
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={550} sx={{ borderRadius: 3, mb: 4 }} />
          <Grid container spacing={5}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="text" height={80} width="80%" />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="rectangular" height={200} sx={{mt: 2, borderRadius: 2}}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <Navbar />
        <Container sx={{ textAlign: 'center', py: 15 }}>
          <Typography variant="h4">Trip not found</Typography>
          <Typography color="text.secondary" sx={{mt: 1}}>We couldn't find the trip you're looking for.</Typography>
          <Button component={Link} to="/trips" variant="contained" sx={{mt: 3}}>Explore Other Trips</Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <StickyHeader trip={trip} />
      <Box sx={{pt: 8}}>
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={7} lg={8}>
              <Stack spacing={5}>
                <ImageGallery images={trip.images} />
                <TripInfo trip={trip} />
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <Box sx={{ position: 'sticky', top: 100 }} id="booking-section">
                <BookNow trip={trip} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default TripDetails;