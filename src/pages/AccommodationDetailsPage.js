import React, { useEffect, useState } from "react";
import ImageGallery from "../components/TripDetails/ImageGallery";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";
import BookNow from "../components/TripDetails/BookNow";
import StickyAccommodationTitle from "../components/TripDetails/StickyAccommodationTitle";
import { getAllAccommodations } from "../endpoints";
import {
  LocalOffer as OfferIcon,
  CheckCircle as InclusionIcon,
  Cancel as ExclusionIcon,
  Info as OverviewIcon,
  Category as ThemeIcon,
  Star as RatingIcon,
  BusinessCenter,
} from "@mui/icons-material";
// Add at top with other imports
import PlaceIcon from '@mui/icons-material/Place';
import CheckCircle from '@mui/icons-material/CheckCircle'; 
import Cancel from '@mui/icons-material/Cancel';



const AccommodationDetailsPage = ({ isMobile }) => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetch(`${getAllAccommodations}/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => setAccommodation(data))
      .catch((error) => {
        console.error("Error fetching accommodation details:", error);
        alert("Error loading accommodation details. Check console.");
      });
    window.scrollTo(0, 0);
  }, [id]);

  if (!accommodation) return <Skeleton variant="rectangular" height="100vh" />;

  return (
    <>
      <StickyAccommodationTitle accommodation={accommodation} />
      
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 2, sm: 4 },
          pb: 6,
          mt: { xs: 7, sm: 9 },
          position: "relative",
        }}
      >
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ mb: 4 }}>
              <ImageGallery
                images={accommodation.images}
                imageStyle={{ borderRadius: theme.shape.borderRadius }}
              />
            </Box>

                    {/* Amenities Card */}
<DetailCard
  title="Amenities"
  icon={<BusinessCenter color="primary" />}
  content={
    <Grid container spacing={1.5} sx={{ py: 1 }}>
      {accommodation?.amenities?.map((amenity, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 6,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
                borderColor: 'primary.main',
              },
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                letterSpacing: '0.03em',
                fontSize: '0.8rem',
                lineHeight: 1.2,
              }}
            >
              {amenity}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  }
/>

            {/* Details Section */}
            <Stack spacing={3}>
              {/* Destination & Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               
                {accommodation.rating && (
                  <Chip
                    icon={<RatingIcon fontSize="small" />}
                    label={`${accommodation.rating}/5`}
                    color="warning"
                  />
                )}
              </Box>

              {/* Overview Card */}
              <DetailCard
                title="Overview"
                icon={<OverviewIcon color="primary" />}
                content={accommodation.overview}
              />

              {/* Themes Card */}
              <DetailCard
                title="Themes"
                icon={<ThemeIcon color="primary" />}
                content={
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {accommodation.themes.map((theme, index) => (
                      <Chip
                        key={index}
                        label={theme}
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Stack>
                }
              />

              {/* Inclusions & Exclusions */}
              <Grid >
                <Grid item xs={12} md={6}>
                  <DetailCard
                    title="Inclusions"
                    icon={<InclusionIcon color="success" />}
                    content={
                      <Stack spacing={1}>
                        {accommodation.inclusions.map((item, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle fontSize="small" color="success" />
                            <Typography variant="body2">{item}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailCard
                    title="Exclusions"
                    icon={<ExclusionIcon color="error" />}
                    content={
                      <Stack spacing={1}>
                        {accommodation.exclusions.map((item, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Cancel fontSize="small" color="error" />
                            <Typography variant="body2">{item}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    }
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Booking Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                position: { lg: "sticky" },
                top: { lg: 100 },
                mb: { xs: 3, lg: 0 },
                p: { xs: 0, sm: 2 },
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <BookNow trip={accommodation} />
              
              {/* Special Offers */}
              {accommodation.specialOffers && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <OfferIcon color="success" /> Special Offers
                  </Typography>
                  <Typography variant="body2">
                    {accommodation.specialOffers}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ title, icon, content }) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {icon}
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      {typeof content === 'string' ? (
        <Typography variant="body1" color="text.secondary">
          {content}
        </Typography>
      ) : (
        content
      )}
    </CardContent>
  </Card>
);

export default AccommodationDetailsPage;