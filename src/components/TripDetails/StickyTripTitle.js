import React from "react";
import { Paper, Typography, Divider, useTheme, Box } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";


const StickyTripTitle = ({ trip }) => {
  const theme = useTheme();

  return (
    <Paper
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      elevation={0}
      sx={{
        position: "fixed",
        top: { xs: "56px", sm: "64px" },
        left: "25%", // Changed from 25%
        transform: "translateX(-50%)", // Correct centering
        zIndex: 1100,
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "blur(8px)",
        p: { xs: 1, sm: 1.5 },
        textAlign: "center",
        borderRadius: "8px",
        boxShadow: theme.shadows[3],
        width: "fit-content", // Better than auto
        maxWidth: { xs: "90%", sm: "80%" }, // Responsive max-width
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      {/* Duration */}
      <Typography variant="overline" sx={{ 
        fontWeight: 600,
        color: 'text.secondary',
        fontSize: { xs: "0.7rem", sm: "0.75rem" },
        whiteSpace: "nowrap"
      }}>
        {trip?.daysCount}D/{trip?.nightsCount}N
      </Typography>

      {/* Vertical divider - Desktop only */}
      <Divider 
        orientation="vertical" 
        flexItem 
        sx={{ 
          height: 24,
          borderColor: alpha(theme.palette.divider, 0.2),
          display: { xs: 'none', sm: 'block' }
        }} 
      />

      {/* Horizontal divider - Mobile only */}
      <Divider 
        orientation="horizontal" 
        flexItem 
        sx={{ 
          width: '80%',
          display: { xs: 'block', sm: 'none' }
        }} 
      />

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "0.95rem", sm: "1.1rem" },
          lineHeight: 1.2,
          background: "linear-gradient(45deg, #FB8C00 30%, #FFA726 90%)",
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          px: { xs: 1, sm: 0 }
        }}
      >
        {trip?.name}
      </Typography>

      {/* Vertical divider - Desktop only */}
      <Divider 
        orientation="vertical" 
        flexItem 
        sx={{ 
          height: 24,
          borderColor: alpha(theme.palette.divider, 0.2),
          display: { xs: 'none', sm: 'block' }
        }} 
      />

      {/* Price */}
      <Typography
        variant="subtitle1"
        sx={{
          color: '#ff6f00',
          fontWeight: 700,
          fontSize: { xs: "0.875rem", sm: "0.95rem" },
          whiteSpace: "nowrap"
        }}
      >
        ₹{trip?.price?.toLocaleString()}
        <Typography
          component="span"
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: "0.65rem", sm: "0.7rem" },
            ml: 0.5
          }}
        >
          /person
        </Typography>
      </Typography>
    </Paper>
  );
};

export default StickyTripTitle;