// --- START OF FILE src/pages/AdminTripsPage.js ---
import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Navbar2 from "../components/common/Navbar2";
import Footer from "../components/common/Footer";
import { Container, Typography, Box, Grid,  Card, CardContent, Button } from "@mui/material"; // Import Grid, Card, CardContent
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const AdminTripsPage = () => {
  const [trips, setTrips] = useState([]); // State to store trips data
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");
  const { logout } = useAuth(); // Get logout function from auth context
  const navigate = useNavigate();

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/trips/${tripId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          logout();
          navigate('/admin/login');
          return;
        }

        if (!response.ok) throw new Error('Delete failed');
        
        setTrips(prev => prev.filter(trip => trip._id !== tripId));
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete trip');
      }
    }
  };
  

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/trips', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          logout();
          navigate('/admin/login');
          return;
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setTrips(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        alert("Error loading trips. Check console.");
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTrips();
    window.scrollTo(0, 0);
  }, [logout, navigate]); // Add dependencies

  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4, padding: "20px", textAlign: "center" }}>
          <Typography variant="h6">Loading Trip Packages...</Typography>
        </Container>
        <Footer />
        {isMobile && <Navbar2 />}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ paddingTop: "20px", paddingBottom: "20px", }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Explore Trip Packages
        </Typography>

        <Grid container spacing={3}> {/* Grid container to display trip cards */}
        {console.log("Trips array before map:", trips)} {/* <--- KEEP THIS LOG - VERY IMPORTANT */}
          {trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip._id}> {/* Grid item for each trip card */}
              <Card> {/* Card for each trip */}
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {trip.name} {/* Display trip name */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.desc?.substring(0, 100)}... {/* Display short description */}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    Price: ₹{trip.price} {/* Display price */}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {trip.daysCount} Days, {trip.nightsCount} Nights {/* Display duration */}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button component={Link} to={`/trips/${trip._id}`} variant="contained" size="small"> {/* Link to Trip Details page */}
                      View Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/admin/cms/edit-trip/${trip._id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteTrip(trip._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
      <Footer />
      {isMobile && <Navbar2 />}
    </>
  );
};

export default AdminTripsPage;
// --- END OF FILE src/pages/AdminTripsPage.js ---