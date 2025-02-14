// --- START OF FILE Home.js ---
import React from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Home/Hero";
import Feature from "../components/Home/Feature";
import { Box, Container, Typography } from "@mui/material"; // Using Container for layout
import Instagram from "../components/Home/Instagrams";
import Footer from "../components/common/Footer";
import Navbar2 from "../components/common/Navbar2";
import useMediaQuery from "@mui/material/useMediaQuery"; // For responsiveness

const Home = () => {
  const isMobile = useMediaQuery("(max-width:600px)"); // Example breakpoint

  return (
    <Box> {/* Removed sx prop from Box */}
      <Navbar />
      <Hero /> {/* Hero Section - Keep it as is or modify Hero.js for improvements */}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* ADD Container here */}
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Explore Featured Destinations
        </Typography>

        <Feature title="Trending Stays" /> {/* Feature Component for Trending Stays */}
        <Feature title="Popular Destinations" /> {/* Feature Component for Popular Destinations */}

        {/* Categories/Themes Section (Optional - Add if you have categories data or want to implement categories) */}
        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: "bold", padding: "20px" }}>
            Browse by Category
          </Typography>
          <CategoriesSection />  // Create a CategoriesSection component if needed
        </Box> */}

        <Box sx={{ mt: 6 }}> {/* Increased marginTop for Instagram section spacing */}
          <Instagram /> {/* Instagram Section - Keep it as is or modify Instagrams.js for improvements */}
        </Box>
      </Container>

      <Footer /> {/* Footer - Keep it as is */}
      {isMobile && <Navbar2 />} {/* Bottom Navbar for mobile */}
    </Box>
  );
};

export default Home;
// --- END OF FILE Home.js ---