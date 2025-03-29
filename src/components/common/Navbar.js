// --- START OF FILE Navbar.js ---
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundImage: "linear-gradient(to right, #e0f7fa, #b2ebf2)",
  backgroundColor: "transparent",
  boxShadow: "none",
}));

export default function Navbar() {
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{ 
        flexGrow: 1, 
        position: "fixed", 
        zIndex: 1, 
        width: "100%", 
        top: 0,
      }}
    >
      <StyledAppBar position="static">
        <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Box>
              <img
                src="/images/logo.jpg"
                alt="Travel Trail"
                style={{ height: "40px", width: "auto" }}
              />
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Primary Menu Items */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Link to="/trips" style={{ textDecoration: "none", color: "#333" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Trips
              </Typography>
            </Link>
            <Link to="/accommodations" style={{ textDecoration: "none", color: "#333" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Accommodations
              </Typography>
            </Link>
          </Box>

          {/* Hamburger Menu */}
          <HamburgerMenu />
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}
// --- END OF FILE ---