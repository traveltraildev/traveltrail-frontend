import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, Paper } from "@mui/material";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import HotelIcon from "@mui/icons-material/Hotel";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMenu, setCurrentMenu] = useState("trips");
  const [currentPath, setCurrentPath] = useState("trips");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/${currentPath}`, { state: { search: searchQuery } });
    console.log("Search initiated with:", searchQuery);
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
        backgroundImage: `url('https://source.unsplash.com/random/1600x900/?travel')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: { xs: "auto", md: "auto" },
        position: "relative",
        pb: 4,
        mt: 8, // Add top margin to push below navbar
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Icon Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              mx: 2,
              mt: 2,
              p: 2,
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backgroundPosition: "center",
              maxWidth: "500px",
              position: "relative",
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              {options?.map((item) => {
                return (
                  <Grid item>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        borderRadius: "50%",
                        bgcolor: "transparent",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#fff8e1" },
                        backgroundColor:
                          currentMenu === item?.title ? "#ffe082" : "inherit",
                      }}
                      onClick={() => handleCurrentMenu(item)}
                    >
                      {item?.icon}
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, color: "#333" }}
                      >
                        {item?.label || ""}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}

              {/* <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: "#e3f2fd" },
                  }}
                >
                  <ModeOfTravelIcon
                    sx={{ fontSize: "24px", color: "#ff6f00" }}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#333" }}>
                    Trips
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: "#e3f2fd" },
                  }}
                >
                  <HotelIcon sx={{ fontSize: "24px", color: "#ff6f00" }} />
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#333" }}>
                    Hotels
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: "#e3f2fd" },
                  }}
                >
                  <Diversity1Icon sx={{ fontSize: "24px", color: "#ff6f00" }} />
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#333" }}>
                    Group Trips
                  </Typography>
                </Box>
              </Grid> */}
            </Grid>
          </Paper>
        </Grid>

        {/* Search Card */}
        <Grid item xs={12} md={10}>
          <Paper
            elevation={3}
            sx={{
              mx: 2,
              mt: { xs: 2, md: "-50px" }, // Negative margin to overlap
              p: 2,
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              width: "100%",
              maxWidth: "1200px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={2} p={3}>
              {/* Search Field */}
              <Grid item xs={12}>
                <TextField
                  label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ borderRadius: "8px" }}
                />
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} sx={{ mt: 2, textAlign: "center" }}>
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
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
