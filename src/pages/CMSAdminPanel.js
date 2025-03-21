import React from "react";
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Box
} from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";
import useMediaQuery from "@mui/material/useMediaQuery";

const CMSAdminPanel = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

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
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Content Management System
        </Typography>

        {/* Static Pages Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Website Pages
          </Typography>
          <List>
            {cmsPages.map((page) => (
              <ListItem key={page.key} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={page.path}
                  sx={{ backgroundColor: '#f5f5f5', mb: 1 }}
                >
                  <ListItemText 
                    primary={page.name} 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Travel Content Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Travel Management
          </Typography>
          {travelManagement.map((section) => (
            <Box key={section.name} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                {section.name}
              </Typography>
              <List disablePadding>
                {section.actions.map((action) => (
                  <ListItem key={action.name} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={action.path}
                      sx={{ pl: 4, '&:hover': { backgroundColor: '#fff8e1' } }}
                    >
                      <ListItemText 
                        primary={action.name} 
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Container>
      
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default CMSAdminPanel;
// --- END OF FILE src/pages/CMSAdminPanel.js ---