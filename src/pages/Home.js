// src/pages/Home.js
import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
  Skeleton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Hero from "../components/Home/Hero";
import { getAllTrips, getAllAccommodations } from "../endpoints";
import { useNotification } from "../context/NotificationContext";

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { notify } = useNotification();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [tripsResponse, accommodationsResponse] = await Promise.all([
        fetch(getAllTrips),
        fetch(getAllAccommodations),
      ]);

      if (!tripsResponse.ok || !accommodationsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const tripsData = await tripsResponse.json();
      const accommodationsData = await accommodationsResponse.json();

      setTrips((Array.isArray(tripsData) ? tripsData : tripsData?.data || []).slice(0, 7));
      setAccommodations((accommodationsData?.data || []).slice(0, 3));
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{ pt: { xs: 10, md: 12 }, pb: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}
    >
      {/* Hero Section */}
      <Box sx={{ mb: { xs: 6, md: 8 }, borderRadius: 4, overflow: "hidden" }}>
        <Hero backgroundImage="/images/hero.jpg" />
      </Box>

      {/* Featured Trips Section */}
      <SectionWrapper title="Explore Our Featured Trips">
        <HorizontalScrollContainer ariaLabel="Featured trips">
          {loading ? (
            <CardRowSkeleton count={3} />
          ) : error ? (
            <ErrorRow onRetry={fetchData} />
          ) : trips.length > 0 ? (
            trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
          ) : (
            <EmptyRow message="No trips available right now — check back soon!" />
          )}
        </HorizontalScrollContainer>
        <SectionButton to="/trips" text="See All Trips" />
      </SectionWrapper>

      {/* Featured Accommodations Section */}
      <SectionWrapper title="Featured Stays">
        <HorizontalScrollContainer ariaLabel="Featured stays">
          {loading ? (
            <CardRowSkeleton count={3} />
          ) : error ? (
            <ErrorRow onRetry={fetchData} />
          ) : accommodations.length > 0 ? (
            accommodations.map((accommodation) => (
              <AccommodationCard key={accommodation._id} accommodation={accommodation} />
            ))
          ) : (
            <EmptyRow message="No accommodations available at the moment" />
          )}
        </HorizontalScrollContainer>
        <SectionButton to="/accommodations" text="Browse All Stays" variant="outlined" />
      </SectionWrapper>

      {/* Value Proposition Section */}
      <SectionWrapper title="Why Choose Us?" bgColor="background.paper">
        <Grid container spacing={4}>
          {valueProps.map((prop) => (
            <Grid item xs={12} md={4} key={prop.title}>
              <ValuePropCard {...prop} />
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>

      {/* Testimonials Section */}
      <SectionWrapper title="Traveler Experiences">
        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={6} key={testimonial.author}>
              <TestimonialCard {...testimonial} />
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>

      {/* Newsletter Section */}
      <NewsletterSection notify={notify} />
    </Container>
  );
};

// Reusable Components ==============================================

const SectionWrapper = ({ title, children, bgColor }) => (
  <Box
    component="section"
    sx={{
      mb: { xs: 6, md: 8 },
      py: 6,
      px: { xs: 2, md: 4 },
      backgroundColor: bgColor,
      borderRadius: 4,
    }}
  >
    <Typography
      variant="h4"
      component="h2"
      gutterBottom
      sx={{
        textAlign: "center",
        mb: 4,
        position: "relative",
        "&::after": {
          content: '""',
          display: "block",
          width: "60px",
          height: "4px",
          backgroundColor: "primary.main",
          mx: "auto",
          mt: 3,
          borderRadius: 2,
        },
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const HorizontalScrollContainer = ({ children, ariaLabel }) => (
  <Box
    role="list"
    aria-label={ariaLabel}
    sx={{
      display: "flex",
      overflowX: "auto",
      gap: 4,
      py: 2,
      scrollbarWidth: "thin",
      "&::-webkit-scrollbar": { height: "8px" },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "primary.light",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": { backgroundColor: "grey.100" },
    }}
  >
    {children}
  </Box>
);

const CardRowSkeleton = ({ count }) =>
  [...Array(count)].map((_, i) => (
    <Box key={i} sx={{ minWidth: 300, flexShrink: 0, maxWidth: { xs: "80vw", sm: 400 } }}>
      <Skeleton variant="rounded" height={200} />
      <Skeleton variant="text" sx={{ mt: 1 }} width="70%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="90%" />
    </Box>
  ));

const ErrorRow = ({ onRetry }) => (
  <Box sx={{ mx: "auto", py: 4, textAlign: "center" }} role="status">
    <Typography variant="body1" color="text.secondary" gutterBottom>
      We couldn't load this section right now.
    </Typography>
    <Button variant="outlined" color="primary" onClick={onRetry}>
      Try Again
    </Button>
  </Box>
);

const EmptyRow = ({ message }) => (
  <Typography variant="body1" color="text.secondary" sx={{ mx: "auto", py: 4 }} role="status">
    {message}
  </Typography>
);

const cardHoverSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 3,
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: 6,
  },
};

const TripCard = ({ trip }) => (
  <Box role="listitem" sx={{ minWidth: 300, flexShrink: 0, maxWidth: { xs: "80vw", sm: 400 } }}>
    <Card sx={cardHoverSx}>
      <CardMedia
        component="img"
        sx={{ height: 200, width: "100%", objectFit: "cover" }}
        image={trip?.images?.[0] || "/images/defaultImg.png"}
        alt={trip?.name || "Trip"}
        loading="lazy"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          {trip?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {trip?.destination}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip label={`${trip?.daysCount} Days`} size="small" color="secondary" />
          <Typography variant="body1" fontWeight={600}>
            ₹{trip?.price?.toLocaleString()}/person
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {trip?.desc ? `${trip.desc.substring(0, 120)}...` : ""}
        </Typography>
      </CardContent>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        component={RouterLink}
        to={`/trips/${trip._id}`}
        sx={{ py: 1, borderRadius: 0 }}
      >
        Explore Trip
      </Button>
    </Card>
  </Box>
);

const AccommodationCard = ({ accommodation }) => (
  <Box role="listitem" sx={{ minWidth: 300, flexShrink: 0, maxWidth: { xs: "80vw", sm: 400 } }}>
    <Card sx={cardHoverSx}>
      <CardMedia
        component="img"
        sx={{ height: 200, width: "100%", objectFit: "cover" }}
        image={accommodation?.images?.[0] || "/images/defaultImg.png"}
        alt={accommodation?.name || "Accommodation"}
        loading="lazy"
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          {accommodation.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {accommodation.destination}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip label={accommodation.roomType} size="small" color="secondary" />
          <Typography variant="body1" fontWeight={600}>
            ₹{accommodation?.price?.toLocaleString()}/night
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {accommodation?.overview ? `${accommodation.overview.substring(0, 120)}...` : ""}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          component={RouterLink}
          to={`/accommodations/${accommodation._id}`}
          sx={{ py: 1 }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  </Box>
);

const SectionButton = ({ to, text, variant = "contained" }) => (
  <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
    <Button
      component={RouterLink}
      to={to}
      variant={variant}
      color="primary"
      size="large"
      sx={{ px: 5, py: 1.5, borderRadius: "8px", fontSize: "1.1rem" }}
    >
      {text}
    </Button>
  </Box>
);

const ValuePropCard = ({ image, title, content }) => (
  <Card sx={{ height: "100%", p: 3, textAlign: "center", borderRadius: 3 }}>
    <Box sx={{ height: 120, mb: 3 }}>
      <img src={image} alt="" aria-hidden="true" style={{ height: "100%", width: "auto" }} />
    </Box>
    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {content}
    </Typography>
  </Card>
);

const TestimonialCard = ({ text, author, location }) => (
  <Card sx={{ p: { xs: 2, md: 3 }, height: "100%", borderRadius: 3 }}>
    <Typography variant="body1" color="text.secondary" paragraph>
      "{text}"
    </Typography>
    <Typography variant="h6" component="p" fontWeight={700} mt={2}>
      {author}
    </Typography>
    <Typography variant="body2" color="primary">
      {location}
    </Typography>
  </Card>
);

const NewsletterSection = ({ notify }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setEmail("");
    notify("Thanks for subscribing! Travel inspiration is on its way.", "success");
  };

  return (
    <Box
      component="section"
      sx={{
        py: 6,
        px: { xs: 2, md: 4 },
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderRadius: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
        Join Our Travel Community
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
        Get exclusive deals, insider tips, and inspiration delivered to your inbox
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubscribe}
        noValidate
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <TextField
          variant="outlined"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(emailError)}
          helperText={emailError}
          inputProps={{ "aria-label": "Email address" }}
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": { borderRadius: "8px" },
            "& .MuiFormHelperText-root": { bgcolor: "transparent", color: "primary.contrastText" },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ px: 5, py: 1.5, borderRadius: "8px", fontSize: "1.1rem", whiteSpace: "nowrap" }}
        >
          Subscribe
        </Button>
      </Box>
    </Box>
  );
};

// Data =============================================================

const valueProps = [
  {
    image: "/images/expert (2).png",
    title: "Expertly Curated Trips",
    content: "Our travel experts design unforgettable experiences tailored to your preferences.",
  },
  {
    image: "/images/money.png",
    title: "Best Price Guarantee",
    content: "We negotiate directly with providers to bring you the best possible rates.",
  },
  {
    image: "/images/call.png",
    title: "24/7 Travel Support",
    content: "Our dedicated team is always available to assist you during your journey.",
  },
];

const testimonials = [
  {
    text: "The trip was perfectly organized from start to finish. The accommodations were amazing and the local guides were knowledgeable and friendly.",
    author: "Atul Khatri",
    location: "Rishikesh Adventure Trip",
  },
  {
    text: "Stayed at the Platinum Beachfront Resort and it exceeded all expectations. The service was impeccable and the location was perfect.",
    author: "Shivangi Verma",
    location: "Goa Beach Vacation",
  },
];

export default Home;
