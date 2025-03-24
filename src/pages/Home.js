// Replace the existing Home component with this
import React from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Home/Hero";
import Feature from "../components/Home/Feature";
import { Box, Container, Typography } from "@mui/material";
import Instagram from "../components/Home/Instagrams";
import useMediaQuery from "@mui/material/useMediaQuery";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box>
      <Navbar />
      <Hero />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Explore Featured Destinations
        </Typography>
        <Feature title="Trending Stays" />
        <Feature title="Popular Destinations" />
        <Box sx={{ mt: 6 }}>
          <Instagram />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;