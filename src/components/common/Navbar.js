// --- START OF FILE Navbar.js ---
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu"; // Import HamburgerMenu
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Navbar() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ flexGrow: 1, position: "fixed", zIndex: 1, width: "100%", top: 0 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          color: "black",
          backgroundImage: 'linear-gradient(to right, #e0f7fa, #b2ebf2)',
        }}
      >
        <Toolbar>
          <Link to="/">
            <Box>
              <img
                src="/images/logo.jpg"
                alt="Travel Trail"
                style={{ height: "50px", width: "100%" }}
              />
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Typography>
            <PinDropIcon sx={{ mt: "8px", mr: "8px" }} />
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { sm: "block" } }}
          >
            Gurgaon
          </Typography>

           {/* ADDED Trips Link in Navbar */}
           <Typography
            variant="h6"
            component={Link}
            to="/trips"
            color="inherit"
            sx={{ ml: 2, textDecoration: 'none', display: { xs: "none", md: "block" } }} // Hide on xs, show on md+
          >
            Trips
          </Typography>
          
          <Box sx={{ display: "flex" }}>
            {!isSmallScreen ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>,
                <HamburgerMenu />
              </>
            ) : (
              <HamburgerMenu />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// --- END OF FILE Navbar.js ---