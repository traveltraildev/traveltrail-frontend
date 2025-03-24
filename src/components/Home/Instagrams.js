// Replace the existing Instagrams component with this
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import "./Instagram.css";

const Instagram = () => {
  const images = [
    "https://www.instagram.com/reel/DGLYZ9hSAbC/embed/",
    "https://www.instagram.com/reel/DGIDY03JkgF/embed/",
    "https://www.instagram.com/reel/DGFOCQ4pGPH/embed/",
    "https://www.instagram.com/reel/DF429-wpvWf/embed/",
    "https://www.instagram.com/reel/DF0PgzjyUgJ/embed/",
    "https://www.instagram.com/reel/DFvvRHHTNEC/embed/",
    "https://www.instagram.com/reel/DFu-yhWypyZ/embed/",
    "https://www.instagram.com/reel/DFp01FHSLkZ/embed/",
    "https://www.instagram.com/reel/DFnN2j7SWdt/embed/",
    "https://www.instagram.com/reel/DFkysK5S6iN/embed/",
    "https://www.instagram.com/reel/DFgBFMZSssS/embed/",
    "https://www.instagram.com/reel/DB_bcDuSn3T/embed/",
    "https://www.instagram.com/reel/DGLYZ9hSAbC/embed/",
    "https://www.instagram.com/reel/DGIDY03JkgF/embed/",
    "https://www.instagram.com/reel/DGFOCQ4pGPH/embed/",
    "https://www.instagram.com/reel/DF429-wpvWf/embed/",
    "https://www.instagram.com/reel/DF0PgzjyUgJ/embed/",
    "https://www.instagram.com/reel/DFvvRHHTNEC/embed/",
    "https://www.instagram.com/reel/DFu-yhWypyZ/embed/",
    "https://www.instagram.com/reel/DFp01FHSLkZ/embed/",
    "https://www.instagram.com/reel/DFnN2j7SWdt/embed/",
    "https://www.instagram.com/reel/DFkysK5S6iN/embed/",
    "https://www.instagram.com/reel/DFgBFMZSssS/embed/",
    "https://www.instagram.com/reel/DB_bcDuSn3T/embed/",
  ];

  const [isHovered, setIsHovered] = useState(false);
  const speed = "60s"; // Adjust this value for scroll speed

  return (
    <Box className="Instagram">
      <Typography variant="h5" sx={{ padding: "20px", fontWeight: "bold" }}>
        On Our Instagram
      </Typography>
      <Box
        className="imageCard"
        style={{
          "--speed": speed,
          animationPlayState: isHovered ? "paused" : "running", // Pause the animation on hover
        }}
        onMouseEnter={() => setIsHovered(true)} // When hover starts
        onMouseLeave={() => setIsHovered(false)} // When hover ends
      >
        <Box className="scrollContainer" sx={{ display: "flex", gap: "16px" }}>
          {[...images, ...images]?.map((image, id) => (
            <iframe
              key={id}
              src={image}
              width="400"
              height="400"
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              style={{
                border: "none",
                display: "block",
                margin: "0 auto",
              }}
            ></iframe>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Instagram;
