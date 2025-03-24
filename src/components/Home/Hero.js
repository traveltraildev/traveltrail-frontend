// Replace the existing Hero component with this
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import trips from "../../data/trips";
import Button from "@mui/material/Button";

const Hero = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${trips[0]?.images[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: { xs: "400px", md: "500px" },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        Upcoming Weekend Trip
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Shimla Stays (4 Days, 3 Nights) -{" "}
        <span style={{ color: "#33bfff" }}>₹ 2999 /-</span>
      </Typography>
      <Link to="/trips" style={{ textDecoration: "none", color: "white" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#33bfff",
            px: 4,
            py: 2,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#2196f3",
            },
          }}
        >
          Book Now
        </Button>
      </Link>
    </Box>
  );
};

export default Hero;
