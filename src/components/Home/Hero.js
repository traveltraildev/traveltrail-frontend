import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, Paper } from '@mui/material';
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import HotelIcon from '@mui/icons-material/Hotel';
import Diversity1Icon from '@mui/icons-material/Diversity1';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Search initiated with:', searchQuery);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('https://source.unsplash.com/random/1600x900/?travel')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: { xs: 'auto', md: 'auto' },
        position: 'relative',
        pb: 4,
        mt: 8, // Add top margin to push below navbar
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Icon Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              mx: 2,
              mt: 2,
              p: 2,
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '500px',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: '#e3f2fd' },
                  }}
                >
                  <ModeOfTravelIcon sx={{ fontSize: '24px', color: '#2196f3' }} />
                  <Typography variant="body2" sx={{ mt: 0.5, color: '#333' }}>
                    Trips
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: '#e3f2fd' },
                  }}
                >
                  <HotelIcon sx={{ fontSize: '24px', color: '#2196f3' }} />
                  <Typography variant="body2" sx={{ mt: 0.5, color: '#333' }}>
                    Hotels
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { bgcolor: '#e3f2fd' },
                  }}
                >
                  <Diversity1Icon sx={{ fontSize: '24px', color: '#2196f3' }} />
                  <Typography variant="body2" sx={{ mt: 0.5, color: '#333' }}>
                    Group Trips
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Search Card */}
        <Grid item xs={12} md={10}>
          <Paper
            elevation={3}
            sx={{
              mx: 2,
              mt: { xs: 2, md: '-50px' }, // Negative margin to overlap
              p: 2,
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '100%',
              maxWidth: '1200px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Grid container spacing={2} p={3}>
              {/* Search Field */}
              <Grid item xs={12}>
                <TextField
                  label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ borderRadius: '8px' }}
                />
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: '30px',
                    backgroundColor: '#2196f3',
                    '&:hover': { backgroundColor: '#0d47a1' },
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  SEARCH
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;