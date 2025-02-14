// --- START OF FILE src/pages/CMSAdminPanel.js ---
import React from "react";
import { Container, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";
import useMediaQuery from "@mui/material/useMediaQuery";

const CMSAdminPanel = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const cmsPages = [
    { name: "About Us", key: "about-us", path: "/admin/cms/edit/about-us" },
    { name: "Contact Us", key: "contact-us", path: "/admin/cms/edit/contact-us" },
    { name: "Terms & Conditions", key: "terms-and-conditions", path: "/admin/cms/edit/terms-and-conditions" },
  ];

  const adminActions = [ // ADDED adminActions array for admin panel links
    { name: "Add New Trip", path: "/admin/cms/add-trip" }, // Link to Add Trip Page
    { name: "View Trips List", path: "/admin/cms/trips-list" }, // ADDED link to Trips List Page - UPDATED PATH
  ];

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          CMS Admin Panel
        </Typography>
        <Typography variant="h6" gutterBottom>
          Manage Pages:
        </Typography>
        <List>
          {cmsPages.map((page) => (
            <ListItem key={page.key} disablePadding>
              <ListItemButton component={Link} to={page.path}>
                <ListItemText primary={page.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}> {/* Added marginTop for spacing */}
          Admin Actions:
        </Typography>
        <List> {/* NEW List for Admin Actions */}
          {adminActions.map((action) => (
            <ListItem key={action.name} disablePadding>
              <ListItemButton component={Link} to={action.path}>
                <ListItemText primary={action.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default CMSAdminPanel;
// --- END OF FILE src/pages/CMSAdminPanel.js ---