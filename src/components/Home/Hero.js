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
  Fade,
} from '@mui/material';
import { Search, Flight, Hotel, Groups } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Hero = ({ backgroundImage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();

  const handleSearch = () => {
    const path = currentTab === 0 ? '/trips' : '/accommodations';
    navigate(path, { state: { search: searchQuery } });
  };

  const searchTabs = [
    { label: 'Trips', icon: <Explore />, path: '/trips' },
    { label: 'Stays', icon: <Hotel />, path: '/accommodations' },
    { label: 'Groups', icon: <Groups />, path: '/trips' }, // Assuming groups are a type of trip
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '80vh' },
        maxHeight: '800px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* Background Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))'
        }}
      />

      <Fade in={true} timeout={1000}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            }}
          >
            Book Nahi, Belong Karo
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ mt: 2, mb: 4, maxWidth: '600px', mx: 'auto', opacity: 0.9 }}
          >
            Discover curated travel experiences and stays that make you feel like you belong.
          </Typography>

          <Paper
            elevation={8}
            sx={{
              p: 1,
              borderRadius: '16px',
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              mt: 4,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              centered
              sx={{ mb: 2, minHeight: 'auto' }}
            >
              {searchTabs.map((tab, index) => (
                <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" sx={{minHeight: 'auto', pt: 1}} />
              ))}
            </Tabs>

            <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search for ${searchTabs[currentTab].label}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSearch}
                sx={{ px: 4, borderRadius: 2 }}
              >
                <Search />
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

// Dummy icon components if not imported elsewhere
const Explore = () => <Flight />;

export default Hero;