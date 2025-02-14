import { Box, Button, Typography } from "@mui/material";
import React, { useRef } from "react";
import "./Feature.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Feature = ({ title }) => {
  const images = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
    "https://media.istockphoto.com/photos/the-main-attraction-of-paris-and-all-of-europe-is-the-eiffel-tower-in-picture-id1185953092?k=6&m=1185953092&s=612x612&w=0&h=SNiShskOfwQ7Sys5TX0eb5eBxHobktWUfZGrox5LMyk=",
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270",
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
  ];

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
    <Box>
      <Typography variant="h5" sx={{ padding: "20px", fontWeight: "bold" }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ArrowBackIosNewIcon
          onClick={handlePrev}
          sx={{ cursor: "pointer", display: { xs: "none", sm: "inline-flex" } }}
        />
        <Box className="imageCard" ref={scrollRef}>
          {[...images, ...images].map((image, id) => (
            <Box className="image" key={id} sx={{ marginRight: "20px" }}>
              <img
                src={image}
                alt={`img-${id}`}
                style={{
                  height: "178px",
                  width: "220px",
                  borderRadius: "15px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  paddingLeft: "5px",
                  marginTop: "10px",
                }}
              >
                Kashmir/Laddakh Trail
              </Typography>
            </Box>
          ))}
        </Box>
        <ArrowForwardIosIcon
          onClick={handleNext}
          sx={{ cursor: "pointer", display: { xs: "none", sm: "inline-flex" } }}
        />
      </Box>
    </Box>
  );
};

export default Feature;
