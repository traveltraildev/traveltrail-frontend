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
  Stack,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import ImageGallery from "../components/TripDetails/ImageGallery";
import BookNow from "../components/TripDetails/BookNow";
import { getAllAccommodations } from "../endpoints";
import { Bed, People, CheckCircleOutline } from '@mui/icons-material';

// Sticky header that appears on scroll
const StickyHeader = ({ accommodation }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 400,
  });

  return (
    <Slide appear={false} direction="down" in={trigger}>
      <AppBar component="div" elevation={2} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="text.primary" fontWeight="600">{accommodation.name}</Typography>
            <Typography variant="body2" color="text.secondary">{accommodation.destination}</Typography>
          </Box>
          <Button variant="contained" href="#booking-section">Book Now</Button>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

// Section component for styling
const Section = ({ title, children }) => (
  <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'neutral.200' }}>
    <Typography variant="h5" component="h2" fontWeight="600" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

// Main info component for the accommodation
const AccommodationInfo = ({ accommodation }) => (
  <Stack spacing={3}>
    <Section title="Overview">
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {accommodation.overview}
      </Typography>
    </Section>

    <Section title="Details">
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            <Chip icon={<Bed />} label={`Bed: ${accommodation.bedType}`} />
            <Chip icon={<People />} label={`Sleeps: ${accommodation.maxOccupancy}`} />
            <Chip label={`Size: ${accommodation.size}`} />
        </Stack>
    </Section>

    {accommodation.amenities?.length > 0 && (
      <Section title="Amenities">
        <List dense>
            <Grid container spacing={1}>
                {accommodation.amenities.map((item) => (
                    <Grid item xs={12} sm={6} key={item}>
                        <ListItem disableGutters>
                            <ListItemIcon sx={{minWidth: 32}}><CheckCircleOutline color="success" fontSize="small" /></ListItemIcon>
                            <ListItemText primary={item} />
                        </ListItem>
                    </Grid>
                ))}
            </Grid>
        </List>
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

  if (!accommodation) {
    return (
      <Container sx={{ textAlign: 'center', py: 12 }}>
        <Typography variant="h4">Accommodation not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <StickyHeader accommodation={accommodation} />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid item xs={12} md={7} lg={8}>
            <Stack spacing={4}>
              <ImageGallery images={accommodation.images} />
              <AccommodationInfo accommodation={accommodation} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ position: 'sticky', top: 100 }} id="booking-section">
              {/* The BookNow component expects a 'trip' prop, so we pass the accommodation object to it */}
              <BookNow trip={accommodation} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AccommodationDetailsPage;
