// Replace the existing Trips component with this
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Trips = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Trips
      </Typography>
      <Box sx={{ height: 400, backgroundColor: "#f5f5f5" }}>
        {/* Trip listing will be implemented here */}
      </Box>
    </Container>
  );
};

export default Trips;