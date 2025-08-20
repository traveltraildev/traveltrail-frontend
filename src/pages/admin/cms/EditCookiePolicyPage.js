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
import { getAdminAuthHeader } from "../../../utils";
import { BASE_URL } from "../../../endpoints";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const EditCookiePolicyPage = () => {
  const pageKey = "cookie-policy";
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const theme = useTheme();

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'font',
    'list',
    'bullet',
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'image',
    'align'
  ];

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`);
        if (!response.ok) {
           if (response.status === 404) {
            setPageContent({ title: "Cookie Policy", content: "" });
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setPageContent(data);
        }
      } catch (error) {
        setNotification({ type: "error", message: `Failed to load content: ${error.message}` });
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageKey]);

  const handleChange = (e) => {
    setPageContent((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditorChange = (content) => {
    setPageContent((prevData) => ({
      ...prevData,
      content: content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: "", message: "" });
    try {
      const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`, {
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

      setNotification({ type: "success", message: "Cookie Policy updated successfully!" });
    } catch (error) {
      setNotification({ type: "error", message: `Failed to update content: ${error.message}` });
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
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Edit Cookie Policy</Typography>
              <Typography color="text.secondary">Update the content for the cookie policy page.</Typography>
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
                    modules={modules}
                    formats={formats}
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

export default EditCookiePolicyPage;
