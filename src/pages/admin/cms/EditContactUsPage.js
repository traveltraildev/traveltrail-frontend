import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from '@clerk/clerk-react';
import { contactUsPage } from "../../../endpoints";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const EditContactUsPage = () => {
  const { getToken } = useAuth();
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const theme = useTheme();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = await getToken();
        const response = await fetch(contactUsPage, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPageContent(data);
      } catch (error) {
        setNotification({ type: "error", message: `Error fetching content: ${error.message}` });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [getToken]);

  const handleChange = (e) => {
    setPageContent({ ...pageContent, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setPageContent({ ...pageContent, content: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: "", message: "" });
    try {
      const token = await getToken();
      const response = await fetch(contactUsPage, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pageContent),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  setNotification({ type: "success", message: "Contact Us page updated successfully!" });
  window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
  setNotification({ type: "error", message: `Error updating content: ${error.message}` });
  window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !pageContent.title) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: theme.shadows[4] }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Edit Contact Us Page</Typography>
              <Typography color="text.secondary">Update the content for the Contact Us page.</Typography>
            </Box>

            {notification.message && (
              <Alert severity={notification.type} sx={{ width: "100%" }}>
                {notification.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Title"
                  name="title"
                  value={pageContent.title}
                  onChange={handleChange}
                  fullWidth
                />
                <Box sx={{ '.ql-editor': { minHeight: '250px' } }}>
                  <ReactQuill
                    value={pageContent.content}
                    onChange={handleEditorChange}
                    theme="snow"
                    placeholder="Enter content..."
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? <CircularProgress size={26} color="inherit" /> : "Save Changes"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default EditContactUsPage;