// src/components/trips/TripCard.js — single trip card for the Trips listing grid.
import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";

const DEFAULT_IMAGE = "/images/defaultImg.png";

const TripCard = ({ trip, onBook }) => {
  if (!trip) return null;

  const detailsPath = `/trips/${trip._id}`;
  const imageSrc = trip.images?.[0] || DEFAULT_IMAGE;
  const imageAlt = trip.name
    ? `${trip.name}${trip.destination ? ` in ${trip.destination}` : ""}`
    : "Trip photo";

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: 2,
        bgcolor: "background.paper",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          boxShadow: 6,
          transform: { sm: "translateY(-4px)" },
        },
        "&:hover .TripCard-media": {
          transform: "scale(1.05)",
        },
        "&:focus-within": {
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={detailsPath}
        aria-label={`View details for ${trip.name}`}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {/* Image with fixed 16:9 aspect ratio */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "56.25%",
            overflow: "hidden",
            bgcolor: "action.hover",
          }}
        >
          <CardMedia
            component="img"
            className="TripCard-media"
            image={imageSrc}
            alt={imageAlt}
            loading="lazy"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.35s ease",
            }}
          />
          {trip.daysCount != null && (
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: "0.9rem" }} />}
              label={`${trip.daysCount} ${Number(trip.daysCount) === 1 ? "day" : "days"}`}
              size="small"
              sx={(theme) => ({
                position: "absolute",
                top: 10,
                left: 10,
                fontWeight: 600,
                bgcolor: alpha(theme.palette.common.black, 0.65),
                color: "secondary.light",
                "& .MuiChip-icon": { color: "secondary.light" },
              })}
            />
          )}
        </Box>

        <CardContent
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            p: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              color: "text.primary",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {trip.name}
          </Typography>

          {trip.destination && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <PlaceIcon sx={{ fontSize: "1rem", color: "accent.main" }} aria-hidden="true" />
              {trip.destination}
            </Typography>
          )}

          {/* Price */}
          <Box sx={{ mt: "auto", pt: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
              Starts from
            </Typography>
            <Chip
              label={`₹${Number(trip.price || 0).toLocaleString("en-IN")} / person`}
              size="small"
              sx={(theme) => ({
                fontWeight: 700,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.dark",
              })}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* CTAs */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={() => onBook(trip)}
          aria-label={`Book ${trip.name}`}
          sx={{ borderRadius: "8px" }}
        >
          Book Now
        </Button>
        <Button
          component={Link}
          to={detailsPath}
          variant="outlined"
          color="secondary"
          size="small"
          fullWidth
          aria-label={`View details for ${trip.name}`}
          sx={{ borderRadius: "8px" }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;
