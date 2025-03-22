// Replace the existing Navbar2 component with this
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
      <AppBar
        position="fixed"
        color="default"
        sx={{
          backgroundColor: "white",
          top: "auto",
          bottom: 0,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <IconButton
              color="inherit"
              sx={{ display: "block" }}
            >
              <HomeIcon sx={{ fontSize: 30 }} />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Home
              </Typography>
            </IconButton>
          </Link>
          <IconButton color="inherit" sx={{ display: "block" }}>
            <SearchIcon sx={{ fontSize: 30 }} />
            <Typography variant="caption" sx={{ mt: 0.5 }}>
                Search
              </Typography>
          </IconButton>
          <IconButton color="inherit" sx={{ display: "block" }}>
            <FavoriteBorderIcon sx={{ fontSize: 30 }} />
            <Typography variant="caption" sx={{ mt: 0.5 }}>
                Wishlist
              </Typography>
          </IconButton>
          <IconButton color="inherit" sx={{ display: "block" }}>
            <PersonIcon sx={{ fontSize: 30 }} />
            <Typography variant="caption" sx={{ mt: 0.5 }}>
                Profile
              </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar2;