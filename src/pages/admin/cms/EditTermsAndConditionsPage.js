import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAdminAuthHeader } from "../../../utils";
import { tacPage } from "../../../endpoints";
import { useNotification } from "../../../context/NotificationContext";

const EditTermsAndConditionsPage = () => {
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const isMobile = useMediaQuery("(max-width:600px)");
  const { notify } = useNotification();

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
        notify("Couldn't load page content. Please try again later.", "error");
      });
    window.scrollTo(0, 0);
  }, [notify]);

  const handleChange = (e) => {
    setPageContent({ ...pageContent, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setPageContent({ ...pageContent, content: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(tacPage, {
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
      notify("Terms & Conditions page updated successfully!", "success");
    } catch (error) {
      console.error(
        "Error updating Terms & Conditions content via API:",
        error
      );
      notify("Couldn't save changes. Please try again.", "error");
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
    </>
  );
};

export default EditTermsAndConditionsPage;
