import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CircularProgress, useTheme } from "@mui/material";
import { tacPage } from "../endpoints";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const TermsAndConditionsPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(tacPage);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPageContent(data);
      } catch (error) {
        console.error("Error fetching Terms & Conditions content:", error);
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
        <Typography variant="h4">Failed to load Terms & Conditions content.</Typography>
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

        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            p: {xs: 2, md: 4},
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              "& p": {
                mb: 2,
                color: "text.primary",
                fontSize: "1rem",
                lineHeight: 1.7,
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "normal",
                maxWidth: "100%",
                width: "100%",
                textAlign: "left",
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                mt: 3, mb: 1.5, fontWeight: 'bold', color: theme.palette.text.primary
              },
              "& ul": {
                pl: 4,
                ml: 2,
              },
              "& ol": {
                pl: 4,
                ml: 2,
              },
              "& li": {
                mb: 1,
                ml: 0,
                textAlign: "left",
              },
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

export default TermsAndConditionsPage;