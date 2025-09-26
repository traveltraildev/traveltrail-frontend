import React from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useWishlist } from '../context/WishlistContext';
import StandardCard from '../components/common/StandardCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EmptyState from '../components/common/EmptyState';

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  const tripItems = wishlist.filter(item => item.itemType === 'Trip');
  const accommodationItems = wishlist.filter(item => item.itemType === 'Accommodation');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 6 }}>
          My Wishlist
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {wishlist.length === 0 ? (
              <EmptyState
                title="Your Wishlist is Empty"
                message="Start exploring and add your favorite trips and stays to your wishlist!"
              />
            ) : (
              <Grid container spacing={4}>
                {tripItems.map(item => (
                  <Grid item key={item._id} xs={12} sm={6} md={4}>
                    <StandardCard
                      item={item.item}
                      itemType="Trip"
                      title={item.item.name}
                      subtitle={item.item.destination}
                      imageUrl={item.item.images?.[0]}
                      tags={[`${item.item.daysCount} Days`, `${item.item.nightsCount} Nights`]}
                      price={`₹${item.item.price?.toLocaleString()}`}
                      linkTo={`/trips/${item.item._id}`}
                    />
                  </Grid>
                ))}
                {accommodationItems.map(item => (
                  <Grid item key={item._id} xs={12} sm={6} md={4}>
                    <StandardCard
                      item={item.item}
                      itemType="Accommodation"
                      title={item.item.name}
                      subtitle={item.item.destination}
                      imageUrl={item.item.images?.[0]}
                      tags={[item.item.roomType]}
                      price={`₹${item.item.basePrice?.toLocaleString()}/night`}
                      linkTo={`/accommodations/${item.item._id}`}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default WishlistPage;
