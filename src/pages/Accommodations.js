import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Accommodations = () => {
  const [accommodations, setAccommodations] = useState([]); // State to store accommodations data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch("/api/accommodations");

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setAccommodations(data?.data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        alert("Error loading accommodations. Check console.");
      }
    };

    fetchAccommodations();
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
        Explore Your Accommodations
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {accommodations?.map((accommodation) => (
          <Grid item key={accommodation.id} xs={12} sm={6} md={4}>
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
                height="250"
                image={accommodation?.images[0] || "./images/defaultImg.png"}
                alt={accommodation?.name || ""}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {accommodation?.name || ""}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                >
                  {accommodation?.destination || ""} ( ₹{" "}
                  {accommodation?.price || ""})
                </Typography>
                <Link to={accommodation?._id}>
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

export default Accommodations;
