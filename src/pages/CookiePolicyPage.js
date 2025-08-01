import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BASE_URL } from "../endpoints"; // Assuming BASE_URL is in endpoints

const CookiePolicyPage = () => {
  const pageKey = "cookie-policy";
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)"); // Although not used in rendering in AboutUsPage, keeping for consistency

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`);
        if (!response.ok) {
           if (response.status === 404) {
            console.log(`Content for ${pageKey} not found.`);
             setPageContent({ title: "Content Not Found", content: "<p>The content for this page is not available yet.</p>" });
           } else {
            throw new Error(`HTTP error! status: ${response.status}`);
           }
        } else {
           const data = await response.json();
           setPageContent(data);
        }
      } catch (error) {
        console.error(`Error fetching ${pageKey} content:`, error);
        setPageContent({ title: "Error Loading Content", content: "<p>There was an error loading the content for this page.</p>" });
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
    window.scrollTo(0, 0);
  }, [pageKey]);

  if (loading) {
    return (
       <Container maxWidth="md" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
         <CircularProgress />
         <Typography>Loading Cookie Policy content...</Typography>
       </Container>
     );
  }

   // Added a check for pageContent being null after loading, although the catch block sets a default
   if (!pageContent) {
     return (
        <Container maxWidth="md" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography>Failed to load Cookie Policy content.</Typography>
        </Container>
      );
   }


  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}> {/* Added mt for space below navbar */}
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        {pageContent.title}
      </Typography>

      <Card elevation={3} sx={{ borderRadius: "12px", p: 4 }}>
        <Box
          sx={{
            "& p": {
              mb: 2,
              color: "text.secondary",
              fontSize: "1rem",
              lineHeight: 1.6,
            },
            "& a": { color: "primary.main", textDecoration: "none" },
          }}
          dangerouslySetInnerHTML={{ __html: pageContent.content }}
        />
      </Card>
    </Container>
  );
};

export default CookiePolicyPage;