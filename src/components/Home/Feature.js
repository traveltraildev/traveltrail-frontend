import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import "./Feature.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";

const Feature = ({ title, data, type }) => {
  const scrollRef = useRef(null);
  const scrollAmount = 150;

  useEffect(() => {
    console.log(`${title} Data:`, data); // Log the data being passed
  }, [data]);

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
        <IconButton onClick={handlePrev} disabled={!scrollRef.current?.scrollLeft}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box className="imageCard" ref={scrollRef}>
          {data?.map((item, id) => (
            <Link 
              key={id} 
              to={type === 'trips' ? `/trips/${item._id}` : `/accommodations/${item._id}`} 
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  minWidth: "220px",
                  marginRight: "20px",
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.images[0]} 
                  alt={`img-${id}`} 
                  style={{
                    height: "178px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    p: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2">{item.name}</Typography>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Feature;