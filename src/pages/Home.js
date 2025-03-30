import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Home/Hero";
import Feature from "../components/Home/Feature";
import { Box, Container, Typography } from "@mui/material";
import Instagram from "../components/Home/Instagrams";
import useMediaQuery from "@mui/material/useMediaQuery";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [accommodations, setAccommodations] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchAccommodationsAndTrips = async () => {
      try {
        const [accomResp, tripResp] = await Promise.all([
          fetch("/api/accommodations"),
          fetch("/api/trips"),
        ]);

        if (!accomResp.ok)
          throw new Error(`HTTP error! status: ${accomResp.status}`);
        if (!tripResp.ok)
          throw new Error(`HTTP error! status: ${tripResp.status}`);

        const dataAccommodations = await accomResp.json();
        const dataTrips = await tripResp.json();

        setAccommodations(dataAccommodations.data);
        setTrips(dataTrips);
      } catch (error) {
        console.error("Error fetching accommodations or trips:", error);
      }
    };

    fetchAccommodationsAndTrips();
    window.scrollTo(0, 0);
  }, []);

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
        <Feature
          title="Trending Stays"
          data={accommodations}
          type={"accommodations"}
        />
        <Feature title="Popular Trips" data={trips} type={"trips"} />
        <Box sx={{ mt: 6 }}>
          <Instagram />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
