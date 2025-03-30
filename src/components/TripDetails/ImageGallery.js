// Replace the existing ImageGallery component with this
import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
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
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images?.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images?.length]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "relative",
          mb: 2,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {images?.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "500px",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          ""
        )}
        <IconButton
          onClick={handlePrevClick}
          sx={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
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
            right: "10px",
            transform: "translateY(-50%)",
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {images?.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
            sx={{
              width: "60px",
              height: "40px",
              borderRadius: "8px",
              objectFit: "cover",
              cursor: "pointer",
              border: currentImageIndex === index ? "2px solid #33bfff" : "none",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageGallery;