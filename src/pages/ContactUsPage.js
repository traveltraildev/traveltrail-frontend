import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Grid,
  Button,
  Icon,
  Link,
} from "@mui/material";
import { contactUsPage } from "../endpoints";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Email, Phone, WhatsApp, Facebook, Instagram } from "@mui/icons-material";

const ContactUsPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(contactUsPage);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPageContent(data);
      } catch (error) {
        console.error("Error fetching Contact Us content:", error);
        setPageContent({
          title: "Error Loading Content",
          content:
            "<p>There was an error loading the content for this page.</p>",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPageContent();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!pageContent) {
    return (
      <Box sx={{ textAlign: "center", py: 12 }}>
        <Typography variant="h4">
          Failed to load Contact Us content.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          {pageContent.title}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 3, p: { xs: 2, md: 4 }, height: '100%' }}>
              <Box
                sx={{
                  "& p": {
                    mb: 2,
                    color: "text.primary",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                  },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    mt: 3,
                    mb: 1.5,
                    fontWeight: "bold",
                    color: theme.palette.text.primary,
                  },
                  "& ul": { ml: 3, mb: 2 },
                  "& li": { mb: 1, color: "text.primary" },
                  "& a": {
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: pageContent.content }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ borderRadius: 3, p: { xs: 2, md: 4 }, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{textAlign: 'center', fontWeight: 'bold'}}>
                  Get in Touch with Trishelta Travels
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: 'center' }}>
                  <Icon sx={{ mr: 2 }}>
                    <Phone />
                  </Icon>
                  <Typography>+91 7060400357</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4, justifyContent: 'center' }}>
                  <Icon sx={{ mr: 2 }}>
                    <Email />
                  </Icon>
                  <Typography>info@trishelta.com</Typography>
                </Box>
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    fullWidth
                    href="tel:+917060400357"
                    sx={{ mb: 2, borderRadius: '20px' }}
                  >
                    Call Us
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<WhatsApp />}
                    fullWidth
                    href="https://wa.me/917060400357"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 2, backgroundColor: "#25D366", borderRadius: '20px' }}
                  >
                    Chat on WhatsApp
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Email />}
                    fullWidth
                    href="mailto:info@trishelta.com"
                    sx={{ mb: 2, borderRadius: '20px' }}
                  >
                    Email Us
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Facebook />}
                    fullWidth
                    href="https://www.facebook.com/trishelta/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 2, borderRadius: '20px' }}
                  >
                    Follow on Facebook
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Instagram />}
                    fullWidth
                    href="https://instagram.com/trishelta_travels"
                    target="_blank"
                    rel="noopener noreferrer"
                     sx={{ mb: 2, borderRadius: '20px' }}
                  >
                    Follow on Instagram
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ContactUsPage;