import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Link, 
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const Logo = styled(Box)(({ theme }) => ({
    width: "220px",
    height: "100px",
    marginRight: "0px",
    objectFit: "cover",
    transition: "opacity 0.3s ease",
    "&:hover": {
      opacity: 0.8
    }
  }));

  const socialMedia = [
    { Icon: Facebook, url: "https://facebook.com/trishelta", label: "Facebook" },
    { Icon: Twitter, url: "https://twitter.com/trishelta", label: "Twitter" },
    { Icon: Instagram, url: "https://instagram.com/trishelta_travels", label: "Instagram" },
    { Icon: LinkedIn, url: "https://linkedin.com/company/trishelta", label: "LinkedIn" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: 6,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
      role="contentinfo"
      aria-label="Website footer"
    >
      <Box sx={{
        maxWidth: theme.breakpoints.values.lg,
        mx: 'auto',
        px: theme.spacing(3)
      }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Link component={RouterLink} to="/" style={{ textDecoration: "none" }}>
              <Logo>
                <img
                  src="../../images/mainLogo.svg"
                  alt="Trishelta Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Logo>
            </Link>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <br />
              Creating unforgettable travel experiences through exceptional hospitality.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialMedia.map(({ Icon, url, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Explore
            </Typography>
            <Box component="nav" aria-label="Quick links">
              <Link
                component={RouterLink}
                to="/about-us"
                variant="body2"
                sx={linkStyles(theme)}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact-us"
                variant="body2"
                sx={linkStyles(theme)}
              >
                Contact
              </Link>
              <Link
                component={RouterLink}
                to="/trips"
                variant="body2"
                sx={linkStyles(theme)}
              >
                Trips
              </Link>
              <Link
                component={RouterLink}
                to="/accommodations"
                variant="body2"
                sx={linkStyles(theme)}
              >
                Stays
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Legal
            </Typography>
            <Box component="nav" aria-label="Legal links">
              <Link
                component={RouterLink}
                to="/terms-and-conditions"
                variant="body2"
                sx={linkStyles(theme)}
              >
                Terms of Use
              </Link>
              <Link
                component={RouterLink}
                to="/privacy-policy"
                variant="body2"
                sx={linkStyles(theme)}
              >
                Privacy Policy
              </Link>
              <Link
                component={RouterLink}
                to="/cookie-policy"
                variant="body2"
                sx={linkStyles(theme)}
            >
                Cookie Policy
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              236/8B, New Sarvodaya Colony, Meerut, U.P
            </Typography>
            <Link
              href="mailto:info@trishelta.com"
              variant="body2"
              sx={linkStyles(theme)}
            >
              info@trishelta.com
            </Link>
            <Box sx={{ mt: 1 }}>
              <Link
                href="tel:+917060400357"
                variant="body2"
                sx={linkStyles(theme)}
              >
                +91 7060400357
              </Link>
              <Link
                href="tel:+917060400358"
                variant="body2"
                sx={linkStyles(theme)}
              >
                +91 7060400358
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={copyrightStyles(theme)}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Trishelta. All rights reserved.
            {!isMobile && ' | '}
            <Link 
              component={RouterLink} // Ensure this is using RouterLink
              to="/accessibility" // Update when created
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              Accessibility Statement
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Reusable styles
const linkStyles = (theme) => ({
  display: 'block',
  mb: 1,
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  }
});

const copyrightStyles = (theme) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  mt: 4,
  pt: 4,
  textAlign: 'center'
});

export default Footer;