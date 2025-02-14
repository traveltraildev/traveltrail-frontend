// --- START OF FILE TermsAndConditionsPage.js ---
import React, { useState, useEffect } from "react"; // <-- ADD THIS IMPORT STATEMENT
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";
import { Container, Typography, Box, Card, CardContent } from "@mui/material"; // ADDED Card and CardContent import
//import cmsData from "../data/cmsData";
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
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ paddingTop: "20px", paddingBottom: "20px", marginTop: "50px" }}> {/* UPDATED marginTop: "50px" */}
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}> {/* Bolder Heading */}
          {pageContent.title}
        </Typography>

        {/* Card wrapping the content Box */}
        <Card elevation={3} sx={{ borderRadius: '12px' }}> {/* Card for content area, added elevation and borderRadius */}
          <CardContent sx={{ padding: '32px' }}> {/* CardContent with increased padding */}
            <Box
              sx={{
                textAlign: "left",
                "& p": { mb: 2, color: 'text.secondary', fontSize: '1rem', lineHeight: 1.6 }, // Improved paragraph styling
                "& a": { color: "primary.main", textDecoration: "none" },
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
            </Box>
          </CardContent>
        </Card>

      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default TermsAndConditionsPage;
// --- END OF FILE TermsAndConditionsPage.js ---