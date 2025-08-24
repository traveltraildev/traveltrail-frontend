
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  Button,
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
