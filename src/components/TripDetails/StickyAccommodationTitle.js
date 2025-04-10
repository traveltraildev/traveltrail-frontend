// Replace the existing StickyAccommodationTitle component with this
import React from "react";
import { Paper, Typography } from "@mui/material";

const StickyAccommodationTitle = ({ accommodation }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: "60px",
        left: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "12px 24px",
        textAlign: "left",
        borderBottom: "1px solid #eee",
        borderRadius: "0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "fit-content",
        left: "24px",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
      >
        {`${accommodation?.name} Accommodation`}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: "text.secondary", fontSize: "0.9rem" }}
      >
        ₹{accommodation?.price}/night
      </Typography>
    </Paper>
  );
};

export default StickyAccommodationTitle;