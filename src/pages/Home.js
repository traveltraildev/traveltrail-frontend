import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Home/Hero";
import Feature from "../components/Home/Feature";
import { Box, Container, Typography } from "@mui/material";
import Instagram from "../components/Home/Instagrams";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [accommodations, setAccommodations] = useState([]); // State to store accommodations data
  const [trips, setTrips] = useState([]); // State to store accommodations data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const accomResp = await fetch("/api/accommodations");
        const tripResp = await fetch("/api/trips");

        if (!accomResp?.ok)
          throw new Error(`HTTP error! status: ${accomResp?.status}`);

        const data = await accomResp?.json();
        setAccommodations(data?.data);
        setTrips(data?.data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        alert("Error loading accommodations. Check console.");
      }
    };

    fetchAccommodations();
    window.scrollTo(0, 0);
  }, [navigate]); // Add dependencies

  return (
    <Box>
      <Navbar />
      <Hero />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Explore Featured Destinations
        </Typography>
        <Feature title="Trending Stays" data={accommodations} />
        <Feature title="Popular Trips" data={trips} />
        <Box sx={{ mt: 6 }}>
          <Instagram />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
