import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { Search, Flight, Hotel, Groups, Explore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSearch = () => {
    const path = searchTabs[currentTab].path;
    navigate(path, { state: { search: searchQuery } });
  };

  const searchTabs = [
    { label: 'Trips', icon: <Explore />, path: '/trips' },
    { label: 'Stays', icon: <Hotel />, path: '/accommodations' },
    { label: 'Groups', icon: <Groups />, path: '/trips' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', md: '90vh' },
        maxHeight: '950px',
        backgroundImage: `url('/images/hero1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
            textShadow: '2px 4px 10px rgba(0,0,0,0.6)',
            letterSpacing: '-1px',
          }}
        >
          Book Nahi, Belong Karo
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{ mt: 2, mb: 5, maxWidth: '700px', mx: 'auto', opacity: 0.9, fontWeight: 300 }}
        >
          Discover unique destinations and unforgettable experiences. Travel with us and create memories that last a lifetime.
        </Typography>

        <Paper
          elevation={12}
          sx={{
            p: 1.5,
            borderRadius: '24px',
            bgcolor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            centered
            sx={{
              mb: 2,
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.secondary.main,
                height: 4,
                borderRadius: 4
              },
              '& .MuiTab-root': {
                color: 'white',
                minHeight: 'auto',
                pt: 1.5,
                pb: 1.5,
                fontSize: '1rem',
                opacity: 0.8,
                '&.Mui-selected': {
                  opacity: 1,
                  color: 'white',
                  fontWeight: 'bold'
                }
              }
            }}
          >
            {searchTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
            ))}
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1.5, p: 1 }}>
            <TextField
              fullWidth
              variant="filled"
              placeholder={`Search for ${searchTabs[currentTab].label}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                borderRadius: 2, 
                '& .MuiFilledInput-underline:before': { borderBottom: 0 },
                '& .MuiFilledInput-root': { bgcolor: 'transparent' },
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSearch}
              sx={{ px: {xs: 3, sm: 5}, borderRadius: 2, boxShadow: theme.shadows[6] }}
            >
              <Search />
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Hero;
