// --- START OF FILE AccommodationDetailsPage.js ---
import React, { useEffect, useState } from "react";
import ImageGallery from "../components/TripDetails/ImageGallery";
import { useParams } from "react-router-dom";
import accommodationsData from "../data/accommodationsData";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import BookNow from "../components/TripDetails/BookNow";
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";
import StickyAccommodationTitle from "../components/TripDetails/StickyAccommodationTitle";

const AccommodationDetailsPage = ({ isMobile }) => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null); // Initialize trip state to null
  // const accommodation = accommodationsData.find(
  //   (acc) => String(acc.id) === String(id)
  // );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // if (!accommodation) {
  //   return <Typography>Accommodation not found</Typography>;
  // }

  useEffect(() => {
    fetch(`/api/accommodations/${id}`) // Fetch specific trip data from backend API using tripId
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAccommodation(data); // Set fetched trip data to state
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        alert("Error loading trip details. Check console.");
      });
    window.scrollTo(0, 0);
  }, [id]); // useEffect dependency on id - fetch data when id changes

  return (
    <>
      <Navbar />
      <StickyAccommodationTitle accommodation={accommodation} />
      <Container
        maxWidth="lg"
        sx={{ paddingTop: "20px", paddingBottom: "20px", marginTop: "60px" }}
      >
        <Grid container spacing={2} sx={{ marginTop: "0px" }}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ImageGallery images={accommodation?.images} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ padding: "20px" }}>
                  {/* Overview Section */}
                  <Card elevation={2} sx={{ mb: 2, borderRadius: "15px" }}>
                    <CardContent sx={{ padding: "16px" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Overview
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {accommodation?.overview}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Themes Section */}
                  <Card elevation={2} sx={{ mb: 2, borderRadius: "15px" }}>
                    <CardContent sx={{ padding: "16px" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Themes
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {accommodation?.themes?.map((theme) => " " + theme)}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Inclusions Section */}
                  <Card elevation={2} sx={{ mb: 2, borderRadius: "15px" }}>
                    <CardContent sx={{ padding: "16px" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Inclusions
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(auto-fit, minmax(100px, 1fr))",
                          },
                          gap: "8px",
                        }}
                      >
                        {accommodation?.inclusions?.map((inclusion, index) => (
                          <Typography
                            key={index}
                            sx={{
                              backgroundColor: "skyblue",
                              padding: "4px 8px",
                              borderRadius: "8px",
                              fontSize: "0.875rem",
                              textAlign: "center",
                            }}
                          >
                            {inclusion}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Exclusions Section */}
                  <Card elevation={2} sx={{ borderRadius: "15px" }}>
                    <CardContent sx={{ padding: "16px" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Exclusions
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(auto-fit, minmax(100px, 1fr))",
                          },
                          gap: "8px",
                        }}
                      >
                        {accommodation?.exclusions?.map((exclusion, index) => (
                          <Typography
                            key={index}
                            sx={{
                              backgroundColor: "skyblue",
                              padding: "4px 8px",
                              borderRadius: "8px",
                              fontSize: "0.875rem",
                              textAlign: "center",
                            }}
                          >
                            {exclusion}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              position: { md: "sticky", xs: "static" },
              top: { md: "20px", xs: "auto" },
              height: { md: "calc(100vh - 140px)", xs: "auto" },
              overflowY: { md: "auto", xs: "auto" },
            }}
          >
            <Box sx={{ padding: "10px" }}>
              <BookNow trip={accommodation} />
            </Box>
          </Grid>
        </Grid>
      </Container>
      {!isMobile && <Footer />} {/* Conditionally render Footer for desktop */}
      {isMobile && <Navbar2 />} {/* Conditionally render Navbar2 for mobile */}
    </>
  );
};

export default AccommodationDetailsPage;
// --- END OF FILE AccommodationDetailsPage.js ---
