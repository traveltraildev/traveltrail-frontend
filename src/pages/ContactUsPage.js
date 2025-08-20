import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, CircularProgress, useTheme } from "@mui/material";
import { contactUsPage } from "../endpoints";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

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
        setPageContent({ title: "Error Loading Content", content: "<p>There was an error loading the content for this page.</p>" });
      } finally {
        setLoading(false);
      }
    };
    fetchPageContent();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
         <CircularProgress />
       </Box>
     );
  }

  if (!pageContent) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography variant="h4">Failed to load Contact Us content.</Typography>
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

        <Card elevation={3} sx={{ borderRadius: 3, p: {xs: 2, md: 4} }}>
          <Box
            sx={{
              "& p": {
                mb: 2,
                color: "text.primary",
                fontSize: "1rem",
                lineHeight: 1.7,
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                mt: 3, mb: 1.5, fontWeight: 'bold', color: theme.palette.text.primary
              },
              "& ul": { ml: 3, mb: 2 },
              "& li": { mb: 1, color: "text.primary" },
              "& a": { color: theme.palette.primary.main, textDecoration: "none", '&:hover': { textDecoration: 'underline' } },
            }}
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default ContactUsPage;