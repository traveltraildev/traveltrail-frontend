// --- START OF FILE src/pages/admin/cms/EditTermsAndConditionsPage.js ---
import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Navbar from "../../../components/common/Navbar";
import Navbar2 from "../../../components/common/Navbar2";
import Footer from "../../../components/common/Footer";
// import simulatedAPI from "../../../api/cmsAPI"; // REMOVE simulatedAPI import
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAuthHeader } from "../../../utils";

const EditTermsAndConditionsPage = () => {
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // Fetch content from REAL backend API
    fetch("/api/cms/pages/terms-and-conditions") // API GET request to backend - CORRECT API CALL for Terms & Conditions Edit
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPageContent(data); // Set fetched data to state
      })
      .catch((error) => {
        console.error("Error fetching Terms & Conditions content:", error);
        alert("Error loading content from API. Check console.");
      });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setPageContent({ ...pageContent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/cms/pages/terms-and-conditions", {
        // API PUT request
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(pageContent),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Terms & Conditions page content updated successfully via API!"); // Success feedback - CORRECTED ALERT MESSAGE - REMOVED response
    } catch (error) {
      console.error(
        "Error updating Terms & Conditions content via API:",
        error
      );
      alert("Error updating content via API. Check console."); // Error feedback
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Edit Terms & Conditions Page
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Title"
            name="title"
            value={pageContent.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
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

export default EditTermsAndConditionsPage;
// --- END OF FILE src/pages/admin/cms/EditTermsAndConditionsPage.js ---
