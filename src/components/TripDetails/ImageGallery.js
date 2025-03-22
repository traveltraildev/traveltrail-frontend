// --- START OF FILE ImageGallery.js ---
import React, { useEffect, useState } from "react";
import { Box, IconButton, Grid } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ImageGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images?.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images?.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images?.length); // Simpler next index logic
    }, 3000); // Increased interval to 3 seconds for slower slide

    return () => clearInterval(intervalId);
  }, [images?.length]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {" "}
      {/* Removed marginTop: "100px" */}
      {/* Main large image */}
      <Box
        sx={{
          position: "relative",
          mb: 2,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {" "}
        {/* Added border-radius and overflow hidden */}
        {images?.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "500px", // Increased max height slightly
              objectFit: "cover",
              display: "block", // Prevents extra space below image in some cases
            }}
          />
        ) : (
          ""
        )}
        {/* Navigation buttons */}
        <IconButton
          onClick={handlePrevClick}
          sx={{
            position: "absolute",
            top: "50%",
            left: "10px", // Adjusted position
            transform: "translateY(-50%)",
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Added background for better visibility
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Hover effect
            },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={handleNextClick}
          sx={{
            position: "absolute",
            top: "50%",
            right: "10px", // Adjusted position
            color: "#fff",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Added background
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Hover effect
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      {/* Thumbnails */}
      <Grid
        container
        spacing={2} // Increased spacing between thumbnails
        justifyContent="center"
      >
        {images?.map((image, index) => (
          <Grid item key={index}>
            <Box
              component="img" // Changed to component="img" to directly render image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: "60px", // Increased thumbnail size
                height: "40px", // Increased thumbnail size
                borderRadius: "8px", // Rounded thumbnails
                objectFit: "cover",
                cursor: "pointer",
                opacity: currentImageIndex === index ? 1 : 0.6, // Opacity for current thumbnail
                border:
                  currentImageIndex === index ? "2px solid #33bfff" : "none", // Border for selected thumbnail
                "&:hover": {
                  opacity: 1, // Hover effect on thumbnails
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageGallery;
// --- END OF FILE ImageGallery.js ---
