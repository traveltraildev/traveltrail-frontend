import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tacPage } from "../endpoints";

const TermsAndConditionsPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetch(tacPage)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPageContent(data);
      })
      .catch((error) => {
        console.error("Error fetching Terms & Conditions content:", error);
        alert("Error loading content from API. Check console.");
      });
    window.scrollTo(0, 0);
  }, []);

  if (!pageContent) {
    return <Typography>Loading Terms & Conditions content...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4, px: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        {pageContent.title}
      </Typography>

      <Card
        elevation={3}
        sx={{
          borderRadius: "12px",
          p: 4,
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            "& p": {
              mb: 2,
              color: "text.secondary",
              fontSize: "1rem",
              lineHeight: 1.6,
              overflowWrap: "break-word",
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: "100%",
              width: "100%",
              textAlign: "left", // Left-align text
            },
            "& a": { color: "primary.main", textDecoration: "none" },
            "& ul": {
              pl: 4, // Add left padding for bullet points
              ml: 2, // Add left margin for bullet points
            },
            "& ol": {
              pl: 4, // Add left padding for numbered lists
              ml: 2, // Add left margin for numbered lists
            },
            "& li": {
              mb: 1,
              ml: 0, // Reset left margin for list items
              textAlign: "left", // Left-align list items
            },
            "& h1": {
              fontSize: "2rem",
              fontWeight: "bold",
              mb: 2,
              textAlign: "center", // Center-align headings
            },
            "& h2": {
              fontSize: "1.5rem",
              fontWeight: "bold",
              mb: 1.5,
              textAlign: "left", // Left-align subheadings
            },
            "& h3": {
              fontSize: "1.25rem",
              fontWeight: "bold",
              mb: 1,
              textAlign: "left", // Left-align subheadings
            },
          }}
          dangerouslySetInnerHTML={{ __html: pageContent.content }}
        />
      </Card>
    </Container>
  );
};

export default TermsAndConditionsPage;
