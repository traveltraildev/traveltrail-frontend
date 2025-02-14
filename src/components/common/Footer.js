import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#000",
        padding: "20px",
        textAlign: "center",
        bottom: 0,
      }}
    >
      <Typography variant="body2" color="#fff">
        © {new Date().getFullYear()} Travel Trail. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
