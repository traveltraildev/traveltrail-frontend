// Replace the existing StickyTripTitle component with this
import React from "react";
import { Paper, Typography } from "@mui/material";

const StickyTripTitle = ({ trip }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: { xs: "556px", sm: "64px" },
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1100,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: { xs: "8px 16px", sm: "12px 24px" },
        textAlign: "center",
        borderBottom: "1px solid #eee",
        borderRadius: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        width: "auto",
        maxWidth: "90%",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.1rem" } }}
      >
        {trip?.name}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
      >
        {trip?.daysCount} Days, {trip?.nightsCount} Nights
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "0.9rem" }, ml: "auto" }}
      >
        ₹{trip?.price}/person
      </Typography>
    </Paper>
  );
};

export default StickyTripTitle;


// backdropFilter: "blur(8px)", // Frosted glass effect
