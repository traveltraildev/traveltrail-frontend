import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useTheme
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { 
  Description as DescriptionIcon, 
  FlightTakeoff as FlightTakeoffIcon, 
  Apartment as ApartmentIcon, 
  AddCircleOutline as AddCircleOutlineIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const SectionCard = ({ title, description, icon, children }) => {
  const theme = useTheme();
  return (
    <Card elevation={3} sx={{ borderRadius: 3, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && <Box sx={{ mr: 2, color: theme.palette.primary.main }}>{icon}</Box>}
        <Typography variant="h5" component="h2" fontWeight="600">
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
        {description}
      </Typography>
      <Stack spacing={1.5}>
        {children}
      </Stack>
    </Card>
  );
};

const CMSAdminPanel = () => {
  const theme = useTheme();

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" fontWeight="700" sx={{ mb: 6, textAlign: 'center' }}>
            Content Management System
          </Typography>

          <Grid container spacing={4}>
            {/* Website Pages Management */}
            <Grid item xs={12} md={6} lg={4}>
              <SectionCard 
                title="Website Pages" 
                description="Manage static content for your website pages like About Us, Contact Us, Privacy Policy, etc."
                icon={<DescriptionIcon fontSize="large" />}
              >
                <Button component={RouterLink} to="/admin/cms/edit/about-us" variant="outlined" startIcon={<EditIcon />} fullWidth>Edit About Us</Button>
                <Button component={RouterLink} to="/admin/cms/edit/contact-us" variant="outlined" startIcon={<EditIcon />} fullWidth>Edit Contact Us</Button>
                <Button component={RouterLink} to="/admin/cms/edit/terms-and-conditions" variant="outlined" startIcon={<EditIcon />} fullWidth>Edit Terms & Conditions</Button>
                <Button component={RouterLink} to="/admin/cms/edit/privacy-policy" variant="outlined" startIcon={<EditIcon />} fullWidth>Edit Privacy Policy</Button>
                <Button component={RouterLink} to="/admin/cms/edit/cookie-policy" variant="outlined" startIcon={<EditIcon />} fullWidth>Edit Cookie Policy</Button>
                <Button component={RouterLink} to="/admin/cms/edit/accessibility-statement" variant="outlined" startIcon={<EditIcon />} fullWidth>Edit Accessibility Statement</Button>
              </SectionCard>
            </Grid>

            {/* Trips Management */}
            <Grid item xs={12} md={6} lg={4}>
              <SectionCard 
                title="Trips Management" 
                description="Add, edit, or manage your travel packages and trip details."
                icon={<FlightTakeoffIcon fontSize="large" />}
              >
                <Button component={RouterLink} to="/admin/cms/add-trip" variant="contained" startIcon={<AddCircleOutlineIcon />} fullWidth>Add New Trip</Button>
                <Button component={RouterLink} to="/admin/cms/trips-list" variant="outlined" startIcon={<VisibilityIcon />} fullWidth>View/Manage Trips</Button>
              </SectionCard>
            </Grid>

            {/* Accommodations Management */}
            <Grid item xs={12} md={6} lg={4}>
              <SectionCard 
                title="Accommodations Management" 
                description="Add, edit, or manage your listed accommodations and stays."
                icon={<ApartmentIcon fontSize="large" />}
              >
                <Button component={RouterLink} to="/admin/add-accommodation" variant="contained" startIcon={<AddCircleOutlineIcon />} fullWidth>Add New Accommodation</Button>
                <Button component={RouterLink} to="/admin/accommodations" variant="outlined" startIcon={<VisibilityIcon />} fullWidth>View/Manage Accommodations</Button>
              </SectionCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CMSAdminPanel;
