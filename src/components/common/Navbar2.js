// --- START OF FILE Navbar2.js ---
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";

const Navbar2 = () => {
  return (
    <div>
      {" "}
      <AppBar
        position="fixed"
        color="default"
        sx={{
          backgroundColor: "white",
          top: "auto",
          bottom: 0,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/">
            <IconButton
              color="inherit"
              aria-label="Home"
              sx={{ display: "block" }}
            >
              <HomeIcon sx={{ fontSize: 40 }} />

              <Typography>Home</Typography>
            </IconButton>
          </Link>
          <IconButton
            color="inherit"
            aria-label="Search"
            sx={{ display: "block" }}
          >
            <SearchIcon sx={{ fontSize: 40 }} />
            <Typography>Search</Typography>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Wishlist"
            sx={{ display: "block" }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 40 }} />
            <Typography>Wishlist</Typography>
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Profile"
            sx={{ display: "block" }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
            <Typography>Profile</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar2;
// --- END OF FILE Navbar2.js ---