import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Navbar from "../../../components/common/Navbar";
import Navbar2 from "../../../components/common/Navbar2";
import Footer from "../../../components/common/Footer";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAdminAuthHeader } from "../../../utils";
import { contactUsPage } from "../../../endpoints";

const EditContactUsPage = () => {
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetch(contactUsPage)
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
        console.error("Error fetching Contact Us content:", error);
        alert("Error loading content from API. Check console.");
      });
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setPageContent({ ...pageContent, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setPageContent({ ...pageContent, content: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(contactUsPage, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeader(),
        },
        body: JSON.stringify(pageContent),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Contact Us page content updated successfully via API!");
    } catch (error) {
      console.error("Error updating Contact Us content via API:", error);
      alert("Error updating content via API. Check console.");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Edit Contact Us Page
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
          <ReactQuill
            value={pageContent.content}
            onChange={handleEditorChange}
            modules={ReactQuill.modules}
            formats={ReactQuill.formats}
            theme="snow"
            placeholder="Enter content..."
            style={{ height: "300px" }}
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

export default EditContactUsPage;
