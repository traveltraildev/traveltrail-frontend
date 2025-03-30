// Replace the existing Dashboard component with this
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button
            component={Link}
            to="/admin/cms"
            variant="contained"
            sx={{ width: "100%", py: 2, bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
          >
            Manage CMS Content
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            component={Link}
            to="/admin/accommodations"
            variant="contained"
            sx={{ width: "100%", py: 2, bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
          >
            Manage Accommodations
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;