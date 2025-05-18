import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAuthHeader } from "../../../utils"; // Assuming getAuthHeader is in utils
import { BASE_URL } from "../../../endpoints"; // Assuming BASE_URL is in endpoints

const EditPrivacyPolicyPage = () => {
  const pageKey = "privacy-policy";
  const [pageContent, setPageContent] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`);
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`Content for ${pageKey} not found, starting with empty form.`);
            setPageContent({ title: "", content: "" });
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setPageContent(data);
        }
      } catch (error) {
        console.error(`Error fetching ${pageKey} content:`, error);
        setSnackbarMessage(`Failed to load ${pageKey} content.`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
    window.scrollTo(0, 0);
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
    setSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/api/cms/pages/${pageKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // Use the same getAuthHeader as working pages
        },
        body: JSON.stringify(pageContent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSnackbarMessage(`${pageKey} content updated successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(`Error updating ${pageKey} content:`, error);
      setSnackbarMessage(`Failed to update ${pageKey} content.`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Edit Privacy Policy Page
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
          modules={EditPrivacyPolicyPage.modules}
          formats={EditPrivacyPolicyPage.formats}
          theme="snow"
          placeholder="Enter content..."
          style={{ height: "300px" }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

EditPrivacyPolicyPage.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link', 'image'],
    [{ 'align': [] }],
    ['clean']
  ],
};

EditPrivacyPolicyPage.formats = [
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

export default EditPrivacyPolicyPage;