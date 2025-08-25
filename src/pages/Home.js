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
import { motion } from "framer-motion";
import { getAllTrips, getAllAccommodations, newsletterSubscription } from "../endpoints";

const SectionWrapper = ({ title, subtitle, children, ...props }) => (
  <Box component="section" sx={{ py: { xs: 6, md: 10 } }} {...props}>
    <Container maxWidth="xl">
      <Typography variant="h2" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h6" component="p" color="text.secondary" sx={{ textAlign: 'center', mb: 8, maxWidth: 700, mx: 'auto' }}>
          {subtitle}
        </Typography>
      )}
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
  const [email, setEmail] = useState("");
  const [showNewsletterAnim, setShowNewsletterAnim] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterError("");
    if (!email) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch(newsletterSubscription, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (response.ok) {
        setShowNewsletterAnim(true);
        setEmail("");
        setTimeout(() => setShowNewsletterAnim(false), 2500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setNewsletterError(errorData?.message || 'Newsletter subscription failed');
        console.error('Newsletter subscription failed', errorData);
      }
    } catch (error) {
      setNewsletterError("Network error. Please try again later.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Hero />

      <SectionWrapper
        title="Discover Our Top Travel Packages"
        subtitle="Explore our handpicked selection of unforgettable journeys and vacation packages to breathtaking destinations worldwide. Find your next adventure with Trishelta Travels."
      >
        <HorizontalScrollContainer>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
          )}
        </HorizontalScrollContainer>
      </SectionWrapper>

      <SectionWrapper
        title="Featured Accommodations & Stays"
        subtitle="From luxurious resorts to cozy boutique hotels, discover our curated collection of accommodations designed for comfort and an exceptional travel experience."
        sx={{ bgcolor: 'background.paper' }}
      >
        <HorizontalScrollContainer>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => <CardSkeleton key={index} />)
          ) : (
            accommodations.map((acc) => <AccommodationCard key={acc._id} accommodation={acc} />)
          )}
        </HorizontalScrollContainer>
      </SectionWrapper>

      {/* Why Choose Us Section */}
      <SectionWrapper
        title="Why Choose Trishelta Travels for Your Next Adventure?"
        subtitle="Experience the difference with Trishelta Travels. We are committed to providing seamless travel planning, exceptional value, and unparalleled support for every journey."
      >
        <Grid container spacing={4} justifyContent="center">
    {[{
      image: "/images/expert (2).png",
      title: "Expertly Curated Travel Experiences",
      content: "Every Trishelta Travels itinerary is meticulously crafted by seasoned travel professionals. We design unique, authentic, and stress-free journeys, ensuring every detail is perfect for your adventure."
    }, {
      image: "/images/money.png",
      title: "Unbeatable Value & Transparent Pricing",
      content: "We partner directly with trusted hotels, airlines, and local operators to bring you the best travel deals. Enjoy transparent pricing with no hidden fees, guaranteeing real value for your investment."
    }, {
      image: "/images/call.png",
      title: "Dedicated 24/7 Customer Support",
      content: "From the moment you book until you return home, our dedicated Trishelta Travels team is available 24/7. Your peace of mind is our top priority, with support just a call away, any time, any day."
    }].map((card, idx) => (
      <Grid item xs={12} md={4} key={card.title}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.06, y: -10 }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
              background: 'linear-gradient(135deg, #ffffff 60%, #f9f5f3 100%)',
              position: 'relative',
              transition: 'all 0.35s ease',
              '&:hover': {
                boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                background: 'linear-gradient(135deg, #f9f5f3 60%, #ffffff 100%)'
              }
            }}
            elevation={0}
          >
            {/* Glow Accent */}
            <Box
              sx={{
                position: 'absolute',
                top: -40,
                left: -40,
                width: 120,
                height: 120,
                background: '#FFE5DB',
                filter: 'blur(70px)',
                opacity: 0.5,
                zIndex: 0
              }}
            />
            <CardMedia
              component="img"
              image={card.image}
              alt={card.title}
              sx={{
                width: 220,
                height: 220,
                objectFit: 'contain',
                mx: 'auto',
                mb: 3,
                borderRadius: 3,
                background: '#fff',
                boxShadow: 3,
                position: 'relative',
                zIndex: 1,
                transition: 'transform 0.45s ease',
                '&:hover': { transform: 'scale(1.1) rotate(2deg)' }
              }}
            />
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              sx={{ color: '#D5614A', letterSpacing: 1.2, zIndex: 1, position: 'relative' }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#000',
                minHeight: 80,
                lineHeight: 1.6,
                zIndex: 1,
                position: 'relative',
                textAlign: 'justify'
              }}
            >
              {card.content}
            </Typography>
          </Card>
        </motion.div>
      </Grid>
    ))}
  </Grid>
</SectionWrapper>



      <SectionWrapper
        title="Stay Connected: Join Our Travel Community"
        subtitle="Don't miss out on exclusive travel deals, insider tips, and inspiring destination guides. Subscribe to the Trishelta Travels newsletter today!"
      >
        <Container maxWidth="md">
          <Paper sx={{ p: {xs: 3, sm: 5}, borderRadius: 3, textAlign: 'center', background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`, color: 'white', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" component="h3" sx={{mb: 2, fontWeight: 'bold'}}>
                Join Our Newsletter
            </Typography>
            <Typography variant="body1" sx={{mb: 4, opacity: 0.9}}>
                Get the latest deals, insider tips, and travel inspiration delivered straight to your inbox.
            </Typography>
            {showNewsletterAnim ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  animation: 'fadeInScale 0.7s',
                  '@keyframes fadeInScale': {
                    '0%': { opacity: 0, transform: 'scale(0.5)' },
                    '100%': { opacity: 1, transform: 'scale(1)' }
                  }
                }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#fff" fillOpacity="0.7"/>
                    <path d="M12 21l6 6 10-12" stroke="#43a047" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, animation: 'fadeIn 1s' }}>
                  You’ve been added to our list!
                </Typography>
              </Box>
            ) : (
              <>
                <Stack component="form" onSubmit={handleNewsletterSubmit} direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center">
                  <TextField 
                    variant="filled" 
                    placeholder="Enter your email address" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ 
                      flexGrow: 1, 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      borderRadius: 1, 
                      '& .MuiFilledInput-root': { bgcolor: 'transparent' },
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  />
                  <Button type="submit" variant="contained" color="secondary" size="large" sx={{px: 4, color: theme.palette.secondary.contrastText, fontWeight: 'bold'}}>Subscribe</Button>
                </Stack>
                {newsletterError && (
                  <Typography variant="body2" sx={{ color: '#ffeb3b', mt: 2, fontWeight: 500 }}>
                    {newsletterError}
                  </Typography>
                )}
              </>
            )}
          </Paper>
        </Container>
      </SectionWrapper>
      <Footer />
    </Box>
  );
};

export default Home;
