// --- START OF FILE TripDetails.js ---
import React, { useEffect, useState } from "react";
import ImageGallery from "../components/TripDetails/ImageGallery";
import { useParams } from "react-router-dom";
// import trips from "../data/trips"; // Remove trips import - No longer needed
import { Box, Typography, Container, Grid } from "@mui/material";
import TripInfo from "../components/TripDetails/TripInfo";
import BookNow from "../components/TripDetails/BookNow";
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";
import StickyTripTitle from "../components/TripDetails/StickyTripTitle";


const TripDetails = ({ isMobile }) => {
  const { id } = useParams(); // Get tripId from URL params
  const [trip, setTrip] = useState(null); // Initialize trip state to null
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    fetch(`/api/trips/${id}`) // Fetch specific trip data from backend API using tripId
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setTrip(data); // Set fetched trip data to state
        setLoading(false); // Set loading to false after successful fetch
      })
      .catch(error => {
        console.error("Error fetching trip details:", error);
        alert("Error loading trip details. Check console.");
        setLoading(false); // Set loading to false even on error
      });
    window.scrollTo(0, 0);
  }, [id]); // useEffect dependency on id - fetch data when id changes

  if (loading) { // Loading indicator
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <Typography variant="h6" align="center">Loading trip details...</Typography>
        </Container>
        <Footer />
        <Navbar2 />
      </>
    );
  }

  if (!trip) {  // Error handling if trip data is not found
    return (
      <>
        <Navbar />

        <Container maxWidth="lg" sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <Typography variant="h6" align="center" color="error">Trip not found</Typography>
        </Container>
        <Footer />
        <Navbar2 />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {trip && <StickyTripTitle trip={trip} />}

      <Container maxWidth="lg" sx={{ 
        paddingTop: "100px", // Add space for sticky header 
        paddingBottom: "20px" 
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ImageGallery images={trip.images} /> {/* Use dynamic trip images */}
          </Grid>

          <Grid item xs={12} md={8}>
            <Box>
              <TripInfo trip={trip} /> {/* Pass dynamic trip data to TripInfo */}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <BookNow trip={trip} />{/* Pass dynamic trip data to BookNow */}
          </Grid>
        </Grid>
      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default TripDetails;
// --- END OF FILE TripDetails.js ---