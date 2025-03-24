// Replace the existing Feature component with this
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./Feature.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";

const Feature = ({ title, data }) => {
  // const images = [
  //   "https://images.unsplash.com/photo-1502602898655-3e91760cbb34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80",
  //   "https://images.unsplash.com/photo-1499856171879-897cb031a6c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
  //   "https://media.istockphoto.com/photos/the-main-attraction-of-paris-and-all-of-europe-is-the-eiffel-tower-in-picture-id1185953092?k=6&m=1185953092&s=612x612&w=0&h=SNiShskOfwQ7Sys5TX0eb5eBxHobktWUfZGrox5LMyk=",
  //   "https://images.unsplash.com/photo-1541963463537-d634d363d0f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1000&q=60",
  //   "https://images.unsplash.com/photo-1516577868910-77d50d04c9ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60",
  //   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  //   "https://images.unsplash.com/photo-1503023528077-b7a10d920bd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60",
  // ];

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (data) {
      data?.forEach((d) => {
        let images = [...d?.images];

        setImages((prev) => [...prev, ...images]);
      });
    }
  }, [data]);

  const scrollRef = useRef(null);
  const scrollAmount = 150; // Adjust this to control scroll distance for each button click

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollAmount;
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ padding: "20px", fontWeight: "bold" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={handlePrev}
          sx={{ cursor: "pointer", display: { xs: "none", sm: "inline-flex" } }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box className="imageCard" ref={scrollRef}>
          {images.map((image, id) => (
            <Box
              key={id}
              sx={{
                minWidth: "220px",
                marginRight: "20px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
              }}
            >
              <img
                src={image}
                alt={`img-${id}`}
                style={{
                  height: "178px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          ))}
        </Box>
        <IconButton
          onClick={handleNext}
          sx={{ cursor: "pointer", display: { xs: "none", sm: "inline-flex" } }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Feature;
