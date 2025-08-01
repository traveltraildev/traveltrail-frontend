// src/pages/Home.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Link,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Hero from "../components/Home/Hero";
import { getAllTrips, getAllAccommodations } from "../endpoints";

// Enhanced theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#f57f17",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffeb3b",
      dark: "#fdd835",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Inter', Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
  },
});

const Home = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
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

        if (!tripsResponse.ok || !accommodationsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const tripsData = await tripsResponse.json();
        const accommodationsData = await accommodationsResponse.json();

        // Show 7 trips and 3 accommodations
        setTrips(tripsData.slice(0, 7));
        if (accommodations?.length > 4) {
          setAccommodations(accommodationsData?.data?.slice(0, 3));
        } else {
          setAccommodations(accommodationsData?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Consider adding error state handling here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}
      >
        {/* Hero Section */}
        <Box sx={{ mb: { xs: 6, md: 8 }, borderRadius: 4, overflow: "hidden" }}>
          <Hero backgroundImage="/images/hero.webp" />
        </Box>

        {/* Featured Trips Section */}
        <SectionWrapper title="Explore Our Featured Trips">
          <HorizontalScrollContainer>
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </HorizontalScrollContainer>
          <Link href="/trips">
            <SectionButton text="See All Trips" />
          </Link>
        </SectionWrapper>

        {/* Featured Accommodations Section */}
        <SectionWrapper title="Featured Stays">
          <HorizontalScrollContainer>
            {accommodations?.length > 0 ? (
              accommodations?.map((accommodation) => (
                <AccommodationCard
                  key={accommodation._id}
                  accommodation={accommodation}
                />
              ))
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mx: "auto", py: 4 }}
              >
                No accommodations available at the moment
              </Typography>
            )}
          </HorizontalScrollContainer>
          <Link href="/accommodations">
            <SectionButton text="Browse All Stays" />
          </Link>
        </SectionWrapper>

        {/* Value Proposition Section */}
        <SectionWrapper title="Why Choose Us?" bgColor="#fff">
          <Grid container spacing={4}>
            {valueProps.map((prop, index) => (
              <Grid item xs={12} md={4} key={index}>
                <ValuePropCard {...prop} />
              </Grid>
            ))}
          </Grid>
        </SectionWrapper>

        {/* Testimonials Section */}
        <SectionWrapper title="Traveler Experiences">
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <TestimonialCard {...testimonial} />
              </Grid>
            ))}
          </Grid>
        </SectionWrapper>

        {/* Newsletter Section */}
        <NewsletterSection />
      </Container>
    </ThemeProvider>
  );
};

// Reusable Components ==============================================

const SectionWrapper = ({ title, children, bgColor }) => (
  <Box
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

const HorizontalScrollContainer = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      overflowX: "auto",
      gap: 4,
      py: 2,
      scrollbarWidth: "thin",
      "&::-webkit-scrollbar": {
        height: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "primary.main",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "background.default",
      },
    }}
  >
    {children}
  </Box>
);

const TripCard = ({ trip }) => (
  <Box sx={{ minWidth: 300, flexShrink: 0, maxWidth: { xs: "80vw", sm: 400 } }}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: 200,
          width: "100%",
          objectFit: "cover",
        }}
        image={trip?.images[0] || "/images/placeholder.jpg"}
        alt={trip?.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          {trip?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {trip?.destination}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip label={`${trip.daysCount} Days`} size="small" />
          <Typography variant="body1" fontWeight={600}>
            ₹{trip?.price?.toLocaleString()}/person
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {trip?.desc?.substring(0, 120)}...
        </Typography>
      </CardContent>
      <Link href={`/trips/${trip._id}`}>
        <Button fullWidth variant="contained" component={Link} sx={{ py: 1 }}>
          Explore Trip
        </Button>
      </Link>
    </Card>
  </Box>
);

const AccommodationCard = ({ accommodation }) => (
  <Box sx={{ minWidth: 300, flexShrink: 0, maxWidth: { xs: "80vw", sm: 400 } }}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: 200, width: "100%", objectFit: "cover" }}
        image={
          accommodation.images[0] || "/images/accommodation-placeholder.jpg"
        }
        alt={accommodation.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          {accommodation.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {accommodation.destination}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip label={accommodation.roomType} size="small" />
          <Typography variant="body1" fontWeight={600}>
            ₹{accommodation.price.toLocaleString()}/night
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {accommodation?.overview?.substring(0, 120)}...
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Link href={`/accommodations/${accommodation._id}`}>
          {" "}
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            component={Link}
            sx={{ py: 1 }}
          >
            View Details
          </Button>
        </Link>
      </Box>
    </Card>
  </Box>
);

const SectionButton = ({ href, text }) => (
  <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
    <Button
      component={Link}
      to={href}
      variant="contained"
      size="large"
      sx={{
        px: 5,
        py: 1.5,
        borderRadius: "8px",
        fontSize: "1.1rem",
      }}
    >
      {text}
    </Button>
  </Box>
);

const ValuePropCard = ({ image, title, content }) => (
  <Card sx={{ height: "100%", p: 3, textAlign: "center" }}>
    <Box sx={{ height: 120, mb: 3 }}>
      <img src={image} alt={title} style={{ height: "100%", width: "auto" }} />
    </Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {content}
    </Typography>
  </Card>
);

const TestimonialCard = ({ text, author, location }) => (
  <Card sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
    <Typography variant="body1" color="text.secondary" paragraph>
      "{text}"
    </Typography>
    <Typography variant="h6" fontWeight={700} mt={2}>
      {author}
    </Typography>
    <Typography variant="body2" color="primary">
      {location}
    </Typography>
  </Card>
);

const NewsletterSection = () => (
  <Box
    sx={{
      py: 6,
      px: { xs: 2, md: 4 },
      bgcolor: "primary.main",
      color: "white",
      borderRadius: 4,
      textAlign: "center",
    }}
  >
    <Typography
      variant="h5"
      component="h2"
      gutterBottom
      sx={{ fontWeight: 700 }}
    >
      Join Our Travel Community
    </Typography>
    <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
      Get exclusive deals, insider tips, and inspiration delivered to your inbox
    </Typography>
    <Box
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
        placeholder="Enter your email"
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        sx={{
          px: 5,
          py: 1.5,
          borderRadius: "8px",
          fontSize: "1.1rem",
          whiteSpace: "nowrap",
        }}
      >
        Subscribe
      </Button>
    </Box>
  </Box>
);

// Data =============================================================

const valueProps = [
  {
    image: "/images/expert (2).png",
    title: "Expertly Curated Trips",
    content:
      "Our travel experts design unforgettable experiences tailored to your preferences.",
  },
  {
    image: "/images/money.png",
    title: "Best Price Guarantee",
    content:
      "We negotiate directly with providers to bring you the best possible rates.",
  },
  {
    image: "/images/call.png",
    title: "24/7 Travel Support",
    content:
      "Our dedicated team is always available to assist you during your journey.",
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
