import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Stack,
  Paper,
  TextField
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import Hero from "../components/Home/Hero";
import { getAllTrips, getAllAccommodations } from "../endpoints";
import { useTheme } from '@mui/material/styles';

// Reusable Section Wrapper
const SectionWrapper = ({ title, children, ...props }) => (
  <Box component="section" sx={{ py: { xs: 6, md: 8 } }} {...props}>
    <Container maxWidth="xl">
      <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Container>
  </Box>
);

// Reusable Horizontal Scrolling Container
const HorizontalScrollContainer = ({ children }) => (
  <Stack direction="row" spacing={4} sx={{
    overflowX: 'auto',
    py: 2,
    '::-webkit-scrollbar': { height: 8 },
    '::-webkit-scrollbar-thumb': { bgcolor: 'neutral.300', borderRadius: 4 },
  }}>
    {children}
  </Stack>
);

// Reusable Trip Card
const TripCard = ({ trip }) => {
  const theme = useTheme();
  return (
    <Card sx={{ minWidth: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="200"
        image={trip?.images[0] || "/images/placeholder.jpg"}
        alt={trip?.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" fontWeight="600">{trip.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{trip.destination}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={`${trip.daysCount} Days`} size="small" />
          <Chip label={`${trip.nightsCount} Nights`} size="small" />
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">₹{trip.price?.toLocaleString()}</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={`/trips/${trip._id}`} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  );
};

// Reusable Accommodation Card
const AccommodationCard = ({ accommodation }) => (
    <Card sx={{ minWidth: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardMedia
            component="img"
            height="200"
            image={accommodation?.images[0] || "/images/placeholder.jpg"}
            alt={accommodation?.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" fontWeight="600">{accommodation.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{accommodation.destination}</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={accommodation.roomType} size="small" />
            </Stack>
            <Typography variant="h5" fontWeight="700" color="primary">₹{accommodation.price?.toLocaleString()}/night</Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
            <Button component={RouterLink} to={`/accommodations/${accommodation._id}`} variant="outlined" fullWidth>View Details</Button>
        </Box>
    </Card>
);

// Skeleton Card for Loading State
const CardSkeleton = () => (
  <Box sx={{ minWidth: 320, flexShrink: 0 }}>
    <Skeleton variant="rectangular" height={200} />
    <Box sx={{ pt: 1 }}>
      <Skeleton />
      <Skeleton width="60%" />
    </Box>
  </Box>
);

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsResponse, accommodationsResponse] = await Promise.all([
          fetch(getAllTrips),
          fetch(getAllAccommodations),
        ]);
        const tripsData = await tripsResponse.json();
        const accommodationsData = await accommodationsResponse.json();
        setTrips(tripsData.slice(0, 7));
        setAccommodations(accommodationsData.data?.slice(0, 7) || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Hero backgroundImage="/images/hero.jpg" />

      {/* Featured Trips */}
      <SectionWrapper title="Featured Trips">
        <HorizontalScrollContainer>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
          )}
        </HorizontalScrollContainer>
      </SectionWrapper>

      {/* Featured Stays */}
      <SectionWrapper title="Featured Stays" sx={{ bgcolor: 'neutral.100' }}>
        <HorizontalScrollContainer>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            accommodations.map((acc) => <AccommodationCard key={acc._id} accommodation={acc} />)
          )}
        </HorizontalScrollContainer>
      </SectionWrapper>

      {/* Newsletter Section */}
      <SectionWrapper title="Stay in the Loop">
          <Container maxWidth="sm">
              <Typography variant="body1" color="text.secondary" sx={{textAlign: 'center', mb: 3}}>
                  Join our newsletter to get the latest deals, insider tips, and inspiration delivered to your inbox.
              </Typography>
              <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                  <TextField fullWidth placeholder="Enter your email address" />
                  <Button variant="contained" size="large" sx={{px: 4}}>Subscribe</Button>
              </Stack>
          </Container>
      </SectionWrapper>

    </Box>
  );
};

export default Home;