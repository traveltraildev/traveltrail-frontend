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
  TextField,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/Home/Hero";
import { getAllTrips, getAllAccommodations } from "../endpoints";

const SectionWrapper = ({ title, children, ...props }) => (
  <Box component="section" sx={{ py: { xs: 6, md: 10 } }} {...props}>
    <Container maxWidth="xl">
      <Typography variant="h2" component="h2" sx={{ textAlign: 'center', mb: 8, fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Container>
  </Box>
);

const HorizontalScrollContainer = ({ children }) => (
  <Stack direction="row" spacing={4} sx={{
    overflowX: 'auto',
    py: 2,
    '::-webkit-scrollbar': { height: 8 },
    '::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4 },
    '::-webkit-scrollbar-track': { bgcolor: 'transparent' },
  }}>
    {children}
  </Stack>
);

const TripCard = ({ trip }) => {
  const theme = useTheme();
  return (
    <Card sx={{ minWidth: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] } }}>
      <CardMedia
        component="img"
        height="220"
        image={trip?.images[0] || "/images/placeholder.jpg"}
        alt={trip?.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" fontWeight="600">{trip.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{trip.destination}</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={`${trip.daysCount} Days`} size="small" variant="outlined" />
          <Chip label={`${trip.nightsCount} Nights`} size="small" variant="outlined" />
        </Stack>
        <Typography variant="h5" fontWeight="700" color="primary">₹{trip.price?.toLocaleString()}</Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={`/trips/${trip._id}`} variant="contained" fullWidth>View Details</Button>
      </Box>
    </Card>
  );
};

const AccommodationCard = ({ accommodation }) => {
  const theme = useTheme();
  return (
    <Card sx={{ minWidth: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[10] } }}>
        <CardMedia
            component="img"
            height="220"
            image={accommodation?.images[0] || "/images/placeholder.jpg"}
            alt={accommodation?.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" fontWeight="600">{accommodation.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{accommodation.destination}</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={accommodation.roomType} size="small" variant="outlined" />
            </Stack>
            <Typography variant="h5" fontWeight="700" color="primary">₹{accommodation.price?.toLocaleString()}/night</Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
            <Button component={RouterLink} to={`/accommodations/${accommodation._id}`} variant="contained" fullWidth>View Details</Button>
        </Box>
    </Card>
  )
};

const CardSkeleton = () => (
  <Box sx={{ minWidth: 340, flexShrink: 0 }}>
    <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
    <Box sx={{ pt: 1.5 }}>
      <Skeleton height={30} />
      <Skeleton width="60%" sx={{ mt: 1 }} />
    </Box>
  </Box>
);

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsResponse, accommodationsResponse] = await Promise.all([
          fetch(getAllTrips),
          fetch(getAllAccommodations),
        ]);
        const tripsData = await tripsResponse.json();
        const accommodationsData = await accommodationsResponse.json();
        setTrips(tripsData.slice(0, 8));
        setAccommodations(accommodationsData.data?.slice(0, 8) || []);
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
      <Navbar />
      <Hero />

      <SectionWrapper title="Featured Trips">
        <HorizontalScrollContainer>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
          )}
        </HorizontalScrollContainer>
      </SectionWrapper>

      <SectionWrapper title="Featured Stays" sx={{ bgcolor: 'background.paper' }}>
        <HorizontalScrollContainer>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            accommodations.map((acc) => <AccommodationCard key={acc._id} accommodation={acc} />)
          )}
        </HorizontalScrollContainer>
      </SectionWrapper>

      <SectionWrapper title="Stay in the Loop">
          <Container maxWidth="md">
            <Paper sx={{ p: {xs: 3, sm: 5}, borderRadius: 3, textAlign: 'center', background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`, color: 'white' }}>
              <Typography variant="h4" component="h3" sx={{mb: 2, fontWeight: 'bold'}}>
                  Join Our Newsletter
              </Typography>
              <Typography variant="body1" sx={{mb: 4, opacity: 0.9}}>
                  Get the latest deals, insider tips, and travel inspiration delivered straight to your inbox.
              </Typography>
              <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center">
                  <TextField 
                    variant="filled" 
                    placeholder="Enter your email address" 
                    sx={{ 
                      flexGrow: 1, 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      borderRadius: 1, 
                      '& .MuiFilledInput-root': { bgcolor: 'transparent' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  />
                  <Button variant="contained" color="secondary" size="large" sx={{px: 4, color: theme.palette.secondary.contrastText, fontWeight: 'bold'}}>Subscribe</Button>
              </Stack>
            </Paper>
          </Container>
      </SectionWrapper>
      <Footer />
    </Box>
  );
};

export default Home;
