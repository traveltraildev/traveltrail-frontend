// src/components/Home/Hero.js
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, TextField, Button, Paper } from "@mui/material";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import HotelIcon from "@mui/icons-material/Hotel";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { useNavigate } from "react-router-dom";

const Hero = ({ backgroundImage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMenu, setCurrentMenu] = useState("trips");
  const [currentPath, setCurrentPath] = useState("trips");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/${currentPath}`, { state: { search: searchQuery } });
  };

  const handleCurrentMenu = (item) => {
    setCurrentMenu(item?.title);
    setCurrentPath(item?.path);
  };

  const options = [
    {
      title: "trips",
      path: "trips",
      label: "Trips",
      icon: <ModeOfTravelIcon sx={{ fontSize: "24px", color: "#ff6f00" }} />,
    },
    {
      title: "accommodations",
      path: "accommodations",
      label: "Stays",
      icon: <HotelIcon sx={{ fontSize: "24px", color: "#ff6f00" }} />,
    },
    {
      title: "groups",
      path: "trips",
      label: "Groups",
      icon: <Diversity1Icon sx={{ fontSize: "24px", color: "#ff6f00" }} />,
    },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // height: { xs: 400, md: 600 },
        height: "100%",
        paddingTop: "68px",
        paddingBottom: "68px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 4,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "white",
          fontSize: { xs: "1.5rem", md: "3.5rem" },
          zIndex: 1,
        }}
      >
        Explore Your Next Adventure
      </Typography>

      <Box sx={{ zIndex: 1 }}>
        <Grid container justifyContent="center" sx={{ mt: 4, zIndex: 1 }}>
          <Grid
            item
            xs={7}
            sx={{
              maxWidth: "fit-content",
              margin: "0 auto",
              mb: -7,
              zIndex: 2,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {options.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "transparent",
                    cursor: "pointer",
                    backgroundColor:
                      currentMenu === item.title ? "#ffecb3" : "inherit",
                  }}
                  onClick={() => handleCurrentMenu(item)}
                >
                  {item.icon}
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#333" }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                width: "100%",
                paddingTop: "80px",
              }}
            >
              <TextField
                label={`Search by ${currentMenu}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, borderRadius: "8px" }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: "30px",
                  backgroundColor: "#ffa000",
                  "&:hover": { backgroundColor: "#ff6f00" },
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                SEARCH
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Hero;
