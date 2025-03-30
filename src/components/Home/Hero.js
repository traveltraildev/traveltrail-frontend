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
      <Paper
        elevation={3}
        sx={{
          mx: 2,
          mt: 2,
          p: 2,
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Grid container spacing={2}>
          {/* Icon Navigation */}
          <Grid item xs={12} sx={{ mb: 2 }}>
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
          </Grid>

          {/* Search Field */}
          <Grid item xs={12} sx={{ mt: 3 }}>
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
    </Box>
  );
};

export default Hero;