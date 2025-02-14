// --- START OF FILE StickyTripTitle.js ---
import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";

// --- MODIFIED FILE StickyTripTitle.js ---
const StickyTripTitle = ({ trip }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: { xs: "56px", sm: "64px" }, // Responsive top spacing
        left: "50%", // Center horizontally
        transform: "translateX(-50%)", // Proper centering
        zIndex: 1100, // Higher than navbar
        backgroundColor: "background.paper",
        backdropFilter: "blur(8px)", // Frosted glass effect
        padding: { xs: "8px 16px", sm: "12px 24px" },
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: "24px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        width: "auto",
        maxWidth: "90%",
        display: "flex",
        gap: 1.5,
        alignItems: "baseline",
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h6"
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          whiteSpace: "nowrap"
        }}
      >
        {trip?.name}
      </Typography>
      
      {/* Days/Nights Section */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Chip
          label={`${trip?.daysCount} Days`}
          size="small"
          sx={{ fontWeight: 500 }}
        />
        <Chip
          label={`${trip?.nightsCount} Nights`}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>
      
      {/* Price Section */}
      <Typography
        variant="subtitle2"
        sx={{ 
          color: "text.secondary",
          fontSize: { xs: "0.875rem", sm: "0.9rem" },
          ml: "auto" // Pushes price to right side
        }}
      >
        ₹{trip?.price?.toLocaleString()}/person
      </Typography>
    </Paper>
  );
};

export default StickyTripTitle;
// --- END OF FILE StickyTripTitle.js ---