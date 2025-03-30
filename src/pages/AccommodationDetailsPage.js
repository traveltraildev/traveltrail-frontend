// Replace the existing AccommodationDetailsPage component with this
import React, { useEffect, useState } from "react";
import ImageGallery from "../components/TripDetails/ImageGallery";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import BookNow from "../components/TripDetails/BookNow";
import StickyAccommodationTitle from "../components/TripDetails/StickyAccommodationTitle";

const AccommodationDetailsPage = ({ isMobile }) => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);

  useEffect(() => {
    fetch(`/api/accommodations/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAccommodation(data);
      })
      .catch((error) => {
        console.error("Error fetching trip details:", error);
        alert("Error loading trip details. Check console.");
      });
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
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
                              backgroundColor: "#e3f2fd",
                              padding: "6px 10px",
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
                              backgroundColor: "#e3f2fd",
                              padding: "6px 10px",
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
    </>
  );
};

export default AccommodationDetailsPage;