// --- START OF FILE src/pages/admin/cms/EditAboutUsPage.js ---
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Navbar from "../../../components/common/Navbar";
import Navbar2 from "../../../components/common/Navbar2";
import Footer from "../../../components/common/Footer";
// REMOVE CKEditor 5 Imports - Not needed in reverted version
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import useMediaQuery from "@mui/material/useMediaQuery";

const EditAboutUsPage = () => {
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // Fetch content from REAL backend API (no changes needed here)
    fetch('/api/cms/pages/about-us')
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
        console.error("Error fetching About Us content:", error);
        alert("Error loading content from API. Check console.");
      });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setPageContent((prevData) => ({ ...prevData, [e.target.name]: e.target.value })); // Reverted handleChange
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cms/pages/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageContent), // Send updated content in request body - NO CHANGE HERE
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("About Us page content updated successfully via API!");
    } catch (error) {
      console.error("Error updating About Us content via API:", error);
      alert("Error updating content via API. Check console.");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Edit About Us Page
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Title"
            name="title"
            value={pageContent.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          {/* Reverted back to TextField for Content (HTML) */}
          <TextField
            label="Content (HTML)"
            name="content"
            multiline
            rows={10}
            value={pageContent.content}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default EditAboutUsPage;
// --- END OF FILE src/pages/admin/cms/EditAboutUsPage.js ---