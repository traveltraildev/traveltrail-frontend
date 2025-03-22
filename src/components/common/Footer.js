import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'var(--neutral-900)', // Removed 'var' keyword
        color: "white",
        py: 3,
        mt: 'auto'
      }}
    >
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} Travel Trail. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;