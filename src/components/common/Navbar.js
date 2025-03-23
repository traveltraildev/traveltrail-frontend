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
import HamburgerMenu from "./HamburgerMenu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../context/AuthContext";
import Button from "@mui/material/Button";

export default function Navbar() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box
      sx={{ flexGrow: 1, position: "fixed", zIndex: 1, width: "100%", top: 0 }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          color: "black",
          backgroundImage: "linear-gradient(to right, #e0f7fa, #b2ebf2)",
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

          {/* Common Elements */}
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

          {/* Conditional Admin Elements */}
          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                component={Link}
                to="/admin/cms"
                color="inherit"
                sx={{ ml: 2, textDecoration: "none" }}
              >
                CMS
              </Button>
              <Button color="inherit" onClick={logout} sx={{ mx: 2 }}>
                Logout
              </Button>
              <IconButton
                size="large"
                edge="end"
                aria-label="admin account"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                component={Link}
                to="/trips"
                color="inherit"
                sx={{
                  ml: 2,
                  textDecoration: "none",
                  display: { xs: "none", md: "block" },
                }}
              >
                Trips
              </Typography>
              <Typography
                variant="h6"
                component={Link}
                to="/accommodations"
                color="inherit"
                sx={{
                  ml: 2,
                  textDecoration: "none",
                  display: { xs: "none", md: "block" },
                }}
              >
                Accommodations
              </Typography>
              {!isSmallScreen && (
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="user account"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              )}
              <HamburgerMenu />
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// --- END OF FILE ---
