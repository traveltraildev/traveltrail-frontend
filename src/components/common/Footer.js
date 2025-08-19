import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
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
        '&:hover': {
          color: 'primary.main',
          textDecoration: 'underline',
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
        bgcolor: 'background.paper',
        color: 'text.primary',
        py: { xs: 4, md: 6 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'neutral.200',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 5 }} justifyContent="space-between">
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box component={RouterLink} to="/" sx={{ display: 'inline-block', mb: 2 }}>
              <img
                src="/images/mainLogo.svg"
                alt="Trishelta Logo"
                style={{ height: '48px', width: 'auto' }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Creating unforgettable travel experiences through exceptional hospitality.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialMedia.map(({ Icon, url, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Link Sections */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={{ xs: 4, md: 5 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
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
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Legal
                </Typography>
                <Stack spacing={1.5}>
                  <FooterLink to="/terms-and-conditions">Terms of Use</FooterLink>
                  <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                  <FooterLink to="/cookie-policy">Cookie Policy</FooterLink>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                 <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Contact Us
                </Typography>
                <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary">
                        236/8B, New Sarvodaya Colony, Meerut, U.P
                    </Typography>
                    <Link href="mailto:info@trishelta.com" variant="body2" sx={{color: 'text.secondary', '&:hover': {color: 'primary.main'}}}>info@trishelta.com</Link>
                    <Link href="tel:+917060400357" variant="body2" sx={{color: 'text.secondary', '&:hover': {color: 'primary.main'}}}>+91 7060400357</Link>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Divider sx={{ my: 4 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Trishelta. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
