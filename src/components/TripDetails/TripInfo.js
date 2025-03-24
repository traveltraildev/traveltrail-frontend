// --- START OF FILE TripInfo.js ---
import React from "react";
import { Box, Typography, Card,Chip, CardContent } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccommodationCard from "./AccommodationCard"; // Import AccommodationCard
import { Link } from "react-router-dom"; // Import Link from react-router-dom



const TripInfo = ({ trip }) => {
  if (!trip || !trip.itineraries || !Array.isArray(trip.itineraries)) {
    return (
      <Typography color="error">
        Itinerary data is not available or in incorrect format
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Overview & Themes Section */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "background.paper",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "1.1rem", md: "1.2rem" }
            }}
          >
            Overview
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}
          >
            {trip?.desc}
          </Typography>

          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mt: 3,
              mb: 1,
              fontSize: { xs: "1.1rem", md: "1.2rem" }
            }}
          >
            Themes
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {trip?.themes?.map((theme) => (
              <Chip
                key={theme}
                label={theme}
                size="small"
                sx={{
                  bgcolor: "#94eff7",
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 1.5,
                  py: 0.5
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Inclusions & Exclusions Section */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "background.paper",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "1.1rem", md: "1.2rem" }
            }}
          >
            Inclusions
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
            {trip?.inclusions?.map((inclusion) => (
              <Chip
                key={inclusion}
                label={inclusion}
                size="small"
                sx={{
                  bgcolor: "#94eff7",
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 1.5,
                  py: 0.5
                }}
              />
            ))}
          </Box>

          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mt: 3,
              mb: 1,
              fontSize: { xs: "1.1rem", md: "1.2rem" }
            }}
          >
            Exclusions
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
            {trip?.exclusions?.map((exclusion) => (
              <Chip
                key={exclusion}
                label={exclusion}
                size="small"
                sx={{
                  bgcolor: "#fac5aa",
                  
                  color: "error.main",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 1.5,
                  py: 0.5
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Itinerary Section */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "background.paper",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",

              mb: 2,
              fontSize: { xs: "1.1rem", md: "1.2rem" }
            }}
          >
            Itinerary
          </Typography>
          {trip?.itineraries.map((day, index) => (
            <Accordion
              key={index}
              sx={{
                my: 1,
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider"
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                sx={{
                  bgcolor: "background.default",
                  py: 1.5,
                  px: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider"
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {day.dayTitle || `Day ${index + 1}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  {day.shortDescription}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {day.highlights?.map((highlight, hIndex) => (
                    <Chip
                      key={hIndex}
                      label={highlight}
                      size="small"
                      sx={{
                        bgcolor: "94eff7",
                        color: "primary.main",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        px: 1.5,
                        py: 0.5
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {day.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Accommodation Card */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "background.paper",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Link
            to={`/accommodations/${trip?.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <AccommodationCard trip={trip} />
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TripInfo;
// --- END OF FILE TripInfo.js