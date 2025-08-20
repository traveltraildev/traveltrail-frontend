import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const socialMedia = [
    { Icon: Facebook, url: "https://facebook.com/trishelta", label: "Facebook" },
    { Icon: Twitter, url: "https://twitter.com/trishelta", label: "Twitter" },
    { Icon: Instagram, url: "https://instagram.com/trishelta_travels", label: "Instagram" },
    { Icon: LinkedIn, url: "https://linkedin.com/company/trishelta", label: "LinkedIn" },
  ];

  const FooterLink = ({ to, children }) => (
    <Link
      component={RouterLink}
      to={to}
      variant="body2"
      sx={{
        color: 'text.secondary',
        transition: 'color 0.3s',
        '&:hover': {
          color: theme.palette.primary.main,
          textDecoration: 'none',
        },
      }}
    >
      {children}
    </Link>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        py: { xs: 6, md: 8 },
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 5, md: 6 }} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box component={RouterLink} to="/" sx={{ display: 'inline-block', mb: 2 }}>
              <img
                src="/images/mainLogo.svg"
                alt="TravelTrail Logo"
                style={{ height: '56px', width: 'auto' }}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: 3, maxWidth: 320, color: 'text.secondary' }}>
              Crafting unforgettable journeys and connecting travelers with unique experiences worldwide.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {socialMedia.map(({ Icon, url, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  sx={{ 
                    color: 'text.secondary', 
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s',
                    '&:hover': { 
                      color: 'white', 
                      bgcolor: theme.palette.primary.main,
                      transform: 'translateY(-2px)'
                    } 
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={{ xs: 5, md: 6 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Explore
                </Typography>
                <Stack spacing={1.5}>
                  <FooterLink to="/about-us">About Us</FooterLink>
                  <FooterLink to="/contact-us">Contact</FooterLink>
                  <FooterLink to="/trips">Trips</FooterLink>
                  <FooterLink to="/accommodations">Stays</FooterLink>
                </Stack>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Legal
                </Typography>
                <Stack spacing={1.5}>
                  <FooterLink to="/terms-and-conditions">Terms of Use</FooterLink>
                  <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                  <FooterLink to="/cookie-policy">Cookie Policy</FooterLink>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                 <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Us
                </Typography>
                <Stack spacing={1.5} sx={{ color: 'text.secondary' }}>
                    <Typography variant="body2">
                        236/8B, New Sarvodaya Colony, Meerut, U.P
                    </Typography>
                    <Link href="mailto:info@trishelta.com" variant="body2" sx={{color: 'inherit', textDecoration: 'none', '&:hover': {color: theme.palette.primary.main}}}>info@trishelta.com</Link>
                    <Link href="tel:+917060400357" variant="body2" sx={{color: 'inherit', textDecoration: 'none', '&:hover': {color: theme.palette.primary.main}}}>+91 7060400357</Link>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} TravelTrail. All rights reserved. Built with passion.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
