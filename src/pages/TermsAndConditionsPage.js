// Replace the existing TermsAndConditionsPage component with this
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const TermsAndConditionsPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetch('/api/cms/pages/terms-and-conditions')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPageContent(data);
      })
      .catch(error => {
        console.error("Error fetching Terms & Conditions content:", error);
        alert("Error loading content from API. Check console.");
      });
    window.scrollTo(0, 0);
  }, []);

  if (!pageContent) {
    return <Typography>Loading Terms & Conditions content...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        {pageContent.title}
      </Typography>

      <Card elevation={3} sx={{ borderRadius: '12px', p: 4 }}>
        <Box
          sx={{
            "& p": { mb: 2, color: 'text.secondary', fontSize: '1rem', lineHeight: 1.6 },
            "& a": { color: "primary.main", textDecoration: "none" },
          }}
          dangerouslySetInnerHTML={{ __html: pageContent.content }}
        />
      </Card>
    </Container>
  );
};

export default TermsAndConditionsPage;