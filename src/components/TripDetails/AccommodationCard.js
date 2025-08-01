import React from "react";
import { Box, Typography, Card, CardContent, useTheme } from "@mui/material";

const AccommodationCard = ({ trip }) => {
  const theme = useTheme(); // Hook to access the theme

  return (
    <Card
      elevation={2}
      sx={{
        // borderRadius: "15px", // Removed to allow theme's 12px to apply
        mb: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Added box-shadow to transition
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[4], // Using theme shadow for consistency
        }
      }}
    >
      <Box sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        overflow: 'hidden',
        // Removed borderRadius from here, card itself will clip if needed, or theme.shape.borderRadius can be used if image container needs specific rounding
      }}>
        <img
          src={trip?.images[0] || '/images/defaultImg.png'} // Fallback image
          alt={trip?.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <CardContent sx={{ padding: theme.spacing(2) }}> {/* Use theme spacing */}
        {/* Removed redundant outer Box with padding:"16px" */}
        <Typography
          variant="h6" // Uses theme typography for size and base weight
          component="div" // Good practice for semantic HTML if it's the main title of the card content
          sx={{ fontWeight: "bold", mb: 1 }} // Keep bold, mb for spacing below title
        >
          {trip?.name} {/* Display trip name as title */}
        </Typography>
        <Typography
          variant="body1" // Appropriate for descriptive text
          sx={{ mb: 1 }} // Spacing for details
        >
          {`${trip?.daysCount} Days, ${trip?.nightsCount} Nights`}
        </Typography>
        <Typography
          variant="h5" // Using a larger variant for price makes it prominent
          color="primary" // Use theme's primary color for emphasis
          sx={{ fontWeight: "bold" }}
        >
          ₹{trip?.price}/night
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AccommodationCard;