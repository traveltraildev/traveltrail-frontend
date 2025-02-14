// --- START OF FILE AccommodationCard.js ---
import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const AccommodationCard = ({ trip }) => {
  return (
    <Card elevation={2} sx={{ borderRadius: "15px", mb: 2 }}> {/* Card for Accommodation, added mb */}
      <CardContent sx={{ padding: "16px" }}> {/* Reduced CardContent padding */}
        <Box sx={{ padding: "16px" }}> {/* Reduced Box padding */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 1, fontSize: "1.1rem" }}
          >
            Accommodation
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              mb: 2,
              alignItems: "center",
            }}
          >
            <Box>
              <img
                src={trip?.images[0]}
                alt={trip?.name}
                style={{ height: "60px", borderRadius: "8px" }}
              />
            </Box>
            <Box>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "0.95rem" }}
              >{`${trip?.name} ( ${trip?.daysCount} Days, ${trip?.nightsCount} Nights )`}</Typography>
              <Typography
                variant="body2"
                sx={{ color: "gray", fontSize: "0.85rem" }}
              >{`₹${trip?.price}/night`}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccommodationCard;
// --- END OF FILE AccommodationCard.js ---