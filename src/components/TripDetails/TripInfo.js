// --- START OF FILE TripInfo.js ---
import React from "react";
import { Box, Typography, Card,Chip, CardContent } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccommodationCard from "./AccommodationCard"; // Import AccommodationCard
import { Link } from "react-router-dom"; // Import Link from react-router-dom



const TripInfo = ({ trip }) => {
    console.log("Trip object received in TripInfo:", trip);

    if (!trip || !trip.itineraries || !Array.isArray(trip.itineraries)) {
        return (
          <Typography color="error">
            Itinerary data is not available or in incorrect format
          </Typography>
        );
      }

    console.log("Trip itineraries:", trip.itineraries);

    return (
        <>
            <Box>
                {/* Card for Overview & Themes */}
                <Card elevation={3} sx={{ mb: 2, borderRadius: "15px" }}>
                    <CardContent sx={{ padding: "16px" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mb: 1,
                                fontSize: "1.1rem",
                                textAlign: "left",
                            }}
                        >
                            Overview
                        </Typography>
                        <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "0.95rem" }}>{`${trip?.desc}`}</Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mt: 2,
                                mb: 1,
                                fontSize: "1.1rem",
                                textAlign: "left",
                            }}
                        >
                            Themes
                        </Typography>
                        <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "0.95rem" }}>{`${trip?.themes?.map(theme => " " + theme)}`}</Typography>
                        {console.log("Overview & Themes Card rendered")}
                    </CardContent>
                </Card>

                {/* Card for Inclusions & Exclusions */}
               <Card elevation={3} sx={{ mb: 2, borderRadius: "15px" }}>
                    <CardContent sx={{ padding: "16px" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mb: 1,
                                fontSize: "1.1rem",
                                textAlign: "left",
                            }}
                        >
                            Inclusions
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(auto-fit, minmax(100px, 1fr))",
                                },
                                gap: "8px",
                                mb: 1,
                            }}
                        >
                            {/* Defensive check for trip?.inclusions being an array */}
                            {Array.isArray(trip?.inclusions) && trip.inclusions.map((inclusion, index) => (
                                <Typography
                                    key={inclusion || `inclusion-${index}`}
                                    sx={{
                                        backgroundColor: "#e0f7fa",
                                        color: "#004d40",
                                        padding: "6px 10px",
                                        borderRadius: "10px",
                                        fontSize: "0.9rem",
                                        textAlign: "center",
                                    }}
                                >
                                    {inclusion}
                                </Typography>
                            ))}
                            {/* Fallback if inclusions is not an array or is empty */}
                            { !Array.isArray(trip?.inclusions) || trip?.inclusions.length === 0 && (
                                <Typography>No inclusions listed.</Typography>
                            )}
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                textAlign: "left",
                            }}
                        >
                            Exclusions
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(auto-fit, minmax(100px, 1fr))",
                                },
                                gap: "10px",
                            }}
                        >
                             {/* More explicit conditional rendering for Exclusions */}
            {Array.isArray(trip?.exclusions) ? ( // IF trip?.exclusions is an array
              // Render exclusions list
              trip.exclusions.map((exclusion, index) => (
                <Typography
                  key={exclusion || `exclusion-${index}`}
                  sx={{ /* ... styles ... */ }}
                >
                  {exclusion}
                </Typography>
              ))
            ) : ( // ELSE (if trip?.exclusions is NOT an array or is empty)
              // Render fallback message
              <Typography>No exclusions listed.</Typography>
                            )}
                        </Box>
                        {console.log("Inclusions & Exclusions Card rendered")}
                    </CardContent>
                </Card>

                {/* Card for Itinerary */}
                <Card elevation={3} sx={{ borderRadius: "15px", mb: 2 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 2, textAlign: "left" }}
                        >
                            Itinerary
                        </Typography>
                        <Box>
                            {console.log("Starting to map trip.itineraries:", trip.itineraries)}
                            {trip?.itineraries.map((item, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                   <Accordion sx={{ 
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  mb: 2,
  '&:before': { display: 'none' } // Remove default divider line
}}>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
    aria-controls={`panel${index}-content`}
    id={`panel${index}-header`}
    sx={{
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      '&:hover': { backgroundColor: "#f1f3f5" }
    }}
  >
    <Typography variant="subtitle1" sx={{ 
      fontWeight: 600,
      color: "text.primary",
      fontSize: "1.1rem"
    }}>
      {item.dayTitle || `Day ${index + 1}`}
    </Typography>
  </AccordionSummary>
  
  <AccordionDetails sx={{ pt: 2, pb: 3 }}>
    {item.shortDescription && (
      <Typography variant="body1" sx={{
        fontWeight: 500,
        color: "text.primary",
        fontSize: "1rem",
        mb: 2
      }}>
        {item.shortDescription}
      </Typography>
    )}

    {item.highlights?.length > 0 && (
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: 2
      }}>
        {item.highlights.map((highlight, hIndex) => (
          <Chip
            key={hIndex}
            label={highlight}
            size="small"
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              fontWeight: 500,
              '& .MuiChip-label': { px: 1.25 }
            }}
          />
        ))}
      </Box>
    )}

    {item.description && (
      <Typography variant="body2" sx={{
        color: "text.secondary",
        lineHeight: 1.6,
        fontSize: "0.95rem"
      }}>
        {item.description}
      </Typography>
    )}
  </AccordionDetails>
</Accordion>
                                </Box>
                            ))}
                        </Box>
                        {console.log("Itinerary Card rendered")}
                    </CardContent>
                </Card>

                <Link to={`/accommodations/${trip?.id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Added Link here */}
                    <AccommodationCard trip={trip} /> {/* Render AccommodationCard here, below Itinerary */}
                </Link>

            </Box>
        </>
    );
};

export default TripInfo;
// --- END OF FILE TripInfo.js ---