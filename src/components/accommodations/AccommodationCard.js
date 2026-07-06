// src/components/accommodations/AccommodationCard.js — single accommodation card
// for the Accommodations listing grid.
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
import KingBedIcon from "@mui/icons-material/KingBed";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";

// Note: the previous fallback (/images/placeholder-accom.png) does not exist in
// public/images; defaultImg.png is the shared listing fallback (also used by TripCard).
const DEFAULT_IMAGE = "/images/defaultImg.png";

const AccommodationCard = ({ accommodation }) => {
  if (!accommodation) return null;

  const detailsPath = `/accommodations/${accommodation._id}`;
  const imageSrc = accommodation.images?.[0] || DEFAULT_IMAGE;
  const imageAlt = accommodation.name
    ? `${accommodation.name}${accommodation.destination ? ` in ${accommodation.destination}` : ""}`
    : "Accommodation photo";

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
        "&:hover .AccommodationCard-media": {
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
        aria-label={`View details for ${accommodation.name}`}
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
            className="AccommodationCard-media"
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
          {/* Price-per-night chip */}
          <Chip
            label={`₹${Number(accommodation.price || 0).toLocaleString("en-IN")} / night`}
            size="small"
            sx={(theme) => ({
              position: "absolute",
              bottom: 10,
              left: 10,
              fontWeight: 700,
              bgcolor: alpha(theme.palette.common.black, 0.65),
              color: "secondary.light",
            })}
          />
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
            {accommodation.name}
          </Typography>

          {accommodation.destination && (
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
              {accommodation.destination}
            </Typography>
          )}

          {/* Room type & occupancy */}
          <Box sx={{ mt: "auto", pt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {accommodation.roomType && (
              <Chip
                icon={<KingBedIcon sx={{ fontSize: "0.9rem" }} />}
                label={accommodation.roomType}
                size="small"
                sx={{
                  bgcolor: "grey.100",
                  color: "text.secondary",
                  "& .MuiChip-icon": { color: "accent.main" },
                }}
              />
            )}
            {accommodation.maxOccupancy != null && (
              <Chip
                icon={<GroupsIcon sx={{ fontSize: "0.9rem" }} />}
                label={`${accommodation.maxOccupancy} ${
                  Number(accommodation.maxOccupancy) === 1 ? "guest" : "guests"
                }`}
                size="small"
                sx={{
                  bgcolor: "grey.100",
                  color: "text.secondary",
                  "& .MuiChip-icon": { color: "accent.main" },
                }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      {/* CTA */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={detailsPath}
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          aria-label={`View details for ${accommodation.name}`}
          sx={{ borderRadius: "8px" }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default AccommodationCard;
