import { Box, Typography } from "@mui/material";
import React from "react";
import "./Instagram.css";

const Instagram = () => {
  const images = [
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
    "./images/instaReel1.avif",
  ];

  const speed = "60s"; // Adjust this value for scroll speed

  return (
    <Box className="Instagram">
      <Typography variant="h5" sx={{ padding: "20px", fontWeight: "bold" }}>
        On Our Instagram
      </Typography>
      <Box className="imageCard" style={{ "--speed": speed }}>
        <Box className="scrollContainer">
          {[...images, ...images]?.map((image, id) => (
            <img
              src={image}
              alt={`img-${id}`}
              style={{
                height: "300px",
                width: "200px",
                paddingRight: "20px",
                borderRadius: "15px 40px",
              }}
            />
          ))}
        </Box>
      </Box>

      <Typography
        variant="h5"
        sx={{
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        On Our Instagram
      </Typography>
      <Box sx={{ textAlign: "center" }}>
        <img
          src="./images/instaBtn.png"
          alt=""
          style={{
            width: "100%",
            height: "500px",
          }}
        />
      </Box>
    </Box>
  );
};

export default Instagram;
