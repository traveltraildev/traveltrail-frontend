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
  backgroundImage:
    "linear-gradient(to right, var(--primary-100), var(--primary-100))",
  backgroundColor: "transparent",
  boxShadow: "none",
}));

const Logo = styled(Box)(({ theme }) => ({
  width: "120px", // Adjust the width as needed
  height: "40px", // Adjust the height as needed
  marginRight: "0px", // Add some spacing
  objectFit: "contain", // Maintain aspect ratio
}));

export default function Navbar() {
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "fixed",
        zIndex: (theme) => theme.zIndex.drawer + 2,
        width: "100%",
        top: 0,
      }}
    >
      <StyledAppBar position="static">
        <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo>
              <img
                src="/images/mainLogo.svg"
                alt="Travel Trail"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Logo>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Primary Menu Items */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Link to="/trips" style={{ textDecoration: "none", color: "#333" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Trips
              </Typography>
            </Link>
            <Link
              to="/accommodations"
              style={{ textDecoration: "none", color: "#333" }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Accommodations
              </Typography>
            </Link>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'white' }}>
    <Typography variant="subtitle1" sx={{ p: 2 }}>Profile</Typography>
  </Link>
          </Box>

          {/* Hamburger Menu */}
          <HamburgerMenu />
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}
