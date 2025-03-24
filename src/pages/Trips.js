import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const TripsCard = () => {
  const [trips, setTrips] = useState([]); // State to store trips data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("/api/trips");

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
        alert("Error loading trips. Check console.");
      }
    };

    fetchTrips();
    window.scrollTo(0, 0);
  }, [navigate]); // Add dependencies

  return (
    <Box sx={{ padding: "100px 7%", backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        fontWeight="bold"
        color="#000"
        marginBottom={"30px"}
      >
        Explore Your Next Adventure
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {trips.map((trip) => (
          <Grid item key={trip.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardMedia
                component="img"
                height="250px !important"
                image={trip?.images[0] || "./images/defaultImg.png"}
                alt={trip?.name || ""}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {trip?.name || ""}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  {trip?.destination || ""} ( ₹ {trip?.price || ""})
                </Typography>
                <Link to={trip?._id}>
                  <Button
                    variant="contained"
                    color="black"
                    fullWidth
                    sx={{
                      background: "black",
                      color: "white",
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TripsCard;
