import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from "@mui/material";
import ImageGallery from "../components/TripDetails/ImageGallery";
import BookNow from "../components/TripDetails/BookNow";
import { getAllAccommodations } from "../endpoints";
import { Bed, People, CheckCircleOutline, Place, SquareFoot } from '@mui/icons-material';
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const StickyHeader = ({ accommodation }) => {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 500,
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
              <Typography variant="h6" color="text.primary" fontWeight="600" noWrap>{accommodation.name}</Typography>
              <Typography variant="body2" color="text.secondary">{accommodation.destination}</Typography>
            </Box>
            <Button variant="contained" href="#booking-section" size="small">Book Now</Button>
          </Box>
        </Container>
      </Paper>
    </Slide>
  );
};

const Section = ({ title, children }) => (
  <Box>
    <Typography variant="h5" component="h2" fontWeight="600" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const AccommodationInfo = ({ accommodation }) => (
  <Stack divider={<Divider sx={{ my: 3 }} />} spacing={4}>
    <Box>
      <Typography variant="h3" component="h1" fontWeight="700" gutterBottom>{accommodation.name}</Typography>
      <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
          <Stack direction="row" alignItems="center" spacing={1}><Place fontSize="small"/><Typography>{accommodation.destination}</Typography></Stack>
      </Stack>
    </Box>

    <Section title="Overview">
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {accommodation.overview}
      </Typography>
    </Section>

    <Section title="Details">
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <Chip icon={<Bed />} label={`Bed: ${accommodation.bedType}`} variant="outlined" />
            <Chip icon={<People />} label={`Sleeps: ${accommodation.maxOccupancy}`} variant="outlined" />
            <Chip icon={<SquareFoot />} label={`Size: ${accommodation.size}`} variant="outlined" />
        </Stack>
    </Section>

    {accommodation.amenities?.length > 0 && (
      <Section title="Amenities">
        <Grid container spacing={1}>
            {accommodation.amenities.map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                    <ListItem disableGutters>
                        <ListItemIcon sx={{minWidth: 36}}><CheckCircleOutline color="success" /></ListItemIcon>
                        <ListItemText primary={item} />
                    </ListItem>
                </Grid>
            ))}
        </Grid>
      </Section>
    )}
  </Stack>
);

const AccommodationDetailsPage = () => {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    fetch(`${getAllAccommodations}/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setAccommodation(data))
      .catch((error) => console.error("Error fetching accommodation details:", error))
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

  if (!accommodation) {
    return (
      <>
        <Navbar />
        <Container sx={{ textAlign: 'center', py: 15 }}>
          <Typography variant="h4">Accommodation not found</Typography>
          <Typography color="text.secondary" sx={{mt: 1}}>We couldn't find the accommodation you're looking for.</Typography>
          <Button component={Link} to="/accommodations" variant="contained" sx={{mt: 3}}>Explore Other Stays</Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <StickyHeader accommodation={accommodation} />
      <Box sx={{pt: 8}}>
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={7} lg={8}>
              <Stack spacing={5}>
                <ImageGallery images={accommodation.images} />
                <AccommodationInfo accommodation={accommodation} />
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <Box sx={{ position: 'sticky', top: 100 }} id="booking-section">
                <BookNow trip={accommodation} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AccommodationDetailsPage;
