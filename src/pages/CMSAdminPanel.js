// Replace the existing CMSAdminPanel component with this
import React from "react";
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const CMSAdminPanel = () => {
  // CMS Content Management
  const cmsPages = [
    { name: "About Us", key: "about-us", path: "/admin/cms/edit/about-us" },
    { name: "Contact Us", key: "contact-us", path: "/admin/cms/edit/contact-us" },
    { name: "Terms & Conditions", key: "terms-and-conditions", path: "/admin/cms/edit/terms-and-conditions" },
  ];

  // Travel Content Management
  const travelManagement = [
    { 
      name: "Trips", 
      actions: [
        { name: "Add New Trip", path: "/admin/cms/add-trip" },
        { name: "Manage Trips", path: "/admin/cms/trips-list" }
      ] 
    },
    {
      name: "Accommodations",
      actions: [
        { name: "Add Accommodation", path: "/admin/add-accommodation" },
        { name: "View Accommodations (Public)", path: "/admin/accommodations" }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        Content Management System
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Website Pages
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
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Travel Management
        </Typography>
        {travelManagement.map((section) => (
          <Box key={section.name} sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
              {section.name}
            </Typography>
            <List>
              {section.actions.map((action) => (
                <ListItem key={action.name} disablePadding>
                  <ListItemButton component={Link} to={action.path}>
                    <ListItemText primary={action.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default CMSAdminPanel;