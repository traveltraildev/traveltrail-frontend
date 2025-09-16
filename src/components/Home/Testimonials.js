
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const testimonialsData = [
  {
    quote: "An absolutely unforgettable trip to the Himalayas! Trishelta Travels handled everything with such professionalism. The personalized itinerary was perfect for our family.",
    author: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "/images/avatars/avatar1.jpg",
    rating: 5,
  },
  {
    quote: "The attention to detail was impeccable. From the luxury accommodations to the seamless transfers, every aspect of our European tour was flawless. Highly recommended!",
    author: "Rajiv Singh",
    location: "Dubai, UAE",
    avatar: "/images/avatars/avatar2.jpg",
    rating: 5,
  },
  {
    quote: "Our wildlife safari in Kenya exceeded all expectations. The guides were incredibly knowledgeable, and the lodges were superb. Thank you, Trishelta, for a trip of a lifetime.",
    author: "Anjali Mehta",
    location: "London, UK",
    avatar: "/images/avatars/avatar3.jpg",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial, index }) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} md={4}>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
            borderRadius: 3,
            boxShadow: theme.shadows[3],
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: theme.shadows[10],
            },
          }}
        >
          <CardContent>
            <Rating value={testimonial.rating} readOnly sx={{ mb: 2, color: theme.palette.primary.main }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, color: 'text.secondary' }}>
              "{testimonial.quote}"
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
            <Avatar src={testimonial.avatar} alt={testimonial.author} sx={{ width: 56, height: 56, mr: 2 }} />
            <Box>
              <Typography variant="h6" component="p" fontWeight="600">
                {testimonial.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testimonial.location}
              </Typography>
            </Box>
          </Box>
        </Card>
      </motion.div>
    </Grid>
  );
};

const Testimonials = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h2" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}>
          What Our Clients Say
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ textAlign: 'center', mb: 8, maxWidth: 700, mx: 'auto' }}>
          Real stories from our valued travelers who have explored the world with Trishelta Travels.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;
