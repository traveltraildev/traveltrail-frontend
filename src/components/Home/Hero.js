import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import trips from "../../data/trips";

const Hero = () => {
  console.log(trips);
  return (
    <>
      <Box
        sx={{
          borderRadius: "20px",
          backgroundImage: `url(${trips[0]?.images[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: {
            xs: "20rem",
            md: "25rem",
          },
          backgroundRepeat: "no-repeat",
          paddingLeft: "5%",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.5rem",
              lg: "3rem",
            },
            paddingTop: "150px",
          }}
        >
          Upcoming Weekend Trip
        </Typography>
        <Typography sx={{ color: "#fff", padding: "10px 0px" }}>
          Shimla Stays(4 Days, 3 Nights) -{" "}
          <Typography component="span" sx={{ color: "#33bfff" }}>
            ₹ 2999 /-
          </Typography>
        </Typography>
        <Link to="/trips/1">
          <Button variant="contained" sx={{ backgroundColor: "#33bfff" }}>
            Book Now
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default Hero;
