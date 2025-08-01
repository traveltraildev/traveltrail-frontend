import React from "react";
import { Paper, Typography, Divider, useTheme, Box } from "@mui/material";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";

const StickyAccommodationTitle = ({ accommodation }) => {
  const theme = useTheme();

  return (
    <Paper
    component={motion.div}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    elevation={0}
    sx={{
      width: { sm: "400px", xs: "100%" },
      position: "fixed",
      top: { xs: "56px", sm: "64px" },
      zIndex: 1100,
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
      backdropFilter: "blur(8px)",
      textAlign: "center",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-around",
      gap: "16px",
      padding: "12px",
      boxShadow: theme.shadows[3],
      alignItems: "center",
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    }}
    >
      {/* Destination */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 0.5,
        flexShrink: 1,
        minWidth: 0
      }}>
        <PlaceIcon fontSize="small" sx={{ 
          color: theme.palette.error.main, 
          fontSize: { xs: "1rem", sm: "1.2rem" } 
        }} />
        <Typography
          variant="overline"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            fontSize: { xs: "0.65rem", sm: "0.75rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {accommodation?.destination}
        </Typography>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: 24,
          borderColor: alpha(theme.palette.divider, 0.2),
          display: { xs: "none", sm: "block" },
        }}
      />

      {/* Accommodation Name */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "0.85rem", sm: "1.1rem" },
          lineHeight: 1.2,
          background: "linear-gradient(45deg, #00BFA5 30%, #00E676 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          px: { xs: 0.5, sm: 1 },
          flexShrink: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {accommodation?.name}
      </Typography>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: 24,
          borderColor: alpha(theme.palette.divider, 0.2),
          display: { xs: "none", sm: "block" },
        }}
      />

      {/* Price */}
      <Typography
        variant="subtitle1"
        sx={{
          color: theme.palette.success.main,
          fontWeight: 700,
          fontSize: { xs: "0.75rem", sm: "0.95rem" },
          whiteSpace: "nowrap",
          flexShrink: 0,
          ml: { xs: 0.5, sm: 1 },
        }}
      >
        ₹{accommodation?.price?.toLocaleString()}
        <Typography
          component="span"
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            ml: 0.3,
          }}
        >
          /night
        </Typography>
      </Typography>
    </Paper>
  );
};

export default StickyAccommodationTitle;