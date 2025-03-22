// --- START OF FILE Navbar.js ---
// Replace the entire file with this updated version
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
import { useAuth } from '../../context/AuthContext';
import Button from '@mui/material/Button';

export default function Navbar() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const { isAuthenticated, logout } = useAuth();

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
        <Toolbar sx={{ px: { xs: 1, md: 3 } }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box>
              <img
                src="/images/logo.jpg"
                alt="Travel Trail"
                style={{ height: "40px", width: "auto" }}
              />
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            <PinDropIcon sx={{ mt: "4px", mr: "4px" }} />
            Gurgaon
          </Typography>

          {!isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="user account"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}

          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                component={Link}
                to="/admin/cms"
                color="primary"
                sx={{ ml: 1, mr: 1 }}
              >
                CMS
              </Button>
              <Button 
                color="primary" 
                onClick={logout}
                sx={{ mr: 1 }}
              >
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
          )}

          {!isAuthenticated && isSmallScreen && (
            <HamburgerMenu />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
// --- END OF FILE ---