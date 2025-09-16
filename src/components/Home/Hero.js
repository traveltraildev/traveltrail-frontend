import React, { useState, useEffect } from 'react';
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
import { Parallax } from 'react-scroll-parallax';
import { motion } from 'framer-motion';

const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
];

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const { path, category, theme: tabTheme } = searchTabs[currentTab];
    const state = {};
    if (searchQuery) {
      state.search = searchQuery;
    }
    if (category) {
      state.category = category;
    }
    if (tabTheme) {
      state.theme = tabTheme;
    }
    navigate(path, { state });
  };

  const searchTabs = [
    { label: 'Group Trips', icon: <Groups />, path: '/trips', theme: 'group', tagline: "Pocket-friendly adventures for everyone." },
    { label: 'Trips', icon: <Explore />, path: '/trips', tagline: "Tailored, fully inclusive journeys." },
    { label: 'Stays', icon: <Hotel />, path: '/accommodations', tagline: "Your perfect home away from home." },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '100vh', md: '100vh' },
        maxHeight: '100vh',
      }}
    >
      <Parallax speed={-20}>
        <Box
          sx={{
            height: { xs: '100vh', md: '100vh' },
            maxHeight: '100vh',
            backgroundImage: `url(${heroImages[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 1s ease-in-out',
          }}
        />
      </Parallax>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{ mt: 2, mb: 5, maxWidth: '700px', mx: 'auto', opacity: 0.9, fontWeight: 300 }}
            >
              {searchTabs[currentTab].tagline}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Paper
              elevation={12}
              sx={{
                p: 1.5,
                borderRadius: '24px',
                bgcolor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                maxWidth: '700px',
                mx: 'auto',
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
                  placeholder={`Search for ${searchTabs[currentTab].label.toLowerCase()}...`}
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
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Hero;
