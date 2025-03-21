import { Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button 
            variant="contained" 
            component={Link}
            to="/admin/cms"
            fullWidth
            size="large"
          >
            Manage CMS Content
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button 
            variant="contained" 
            component={Link}
            to="/admin/accommodations"
            fullWidth
            size="large"
          >
            Manage Accommodations
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;