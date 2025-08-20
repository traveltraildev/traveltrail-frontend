import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Paper,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  Grid,
  Divider,
  useTheme
} from '@mui/material';
import { ExpandMore, CheckCircleOutline, HighlightOff, Place, Schedule, Palette } from '@mui/icons-material';

const Section = ({ title, children, icon }) => (
  <Box>
    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
      {icon}
      <Typography variant="h5" component="h2" fontWeight="600">
        {title}
      </Typography>
    </Stack>
    {children}
  </Box>
);

const TripInfo = ({ trip }) => {
  const theme = useTheme();

  if (!trip) {
    return null;
  }

  return (
    <Stack divider={<Divider sx={{ my: 3 }} />} spacing={4}>
      {/* Header Info */}
      <Box>
        <Typography variant="h3" component="h1" fontWeight="700" gutterBottom>{trip.name}</Typography>
        <Stack direction="row" spacing={3} alignItems="center" color="text.secondary">
            <Stack direction="row" alignItems="center" spacing={1}><Place fontSize="small"/><Typography>{trip.destination}</Typography></Stack>
            <Stack direction="row" alignItems="center" spacing={1}><Schedule fontSize="small"/><Typography>{trip.daysCount} Days / {trip.nightsCount} Nights</Typography></Stack>
        </Stack>
      </Box>

      {/* Overview */}
      <Section title="Overview" icon={<Palette color="primary"/>}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {trip.desc}
        </Typography>
      </Section>

      {/* Themes */}
      {trip.themes?.length > 0 && (
        <Section title="Themes">
          <Stack direction="row" flexWrap="wrap" spacing={1.5} useFlexGap>
            {trip.themes.map((themeName) => (
              <Chip key={themeName} label={themeName} color="secondary" sx={{color: theme.palette.secondary.contrastText, fontWeight: 500}} />
            ))}
          </Stack>
        </Section>
      )}

      {/* Inclusions & Exclusions */}
      <Grid container spacing={4}>
        {trip.inclusions?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Section title="What's Included">
              <List dense>
                {trip.inclusions.map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemIcon sx={{minWidth: 36}}><CheckCircleOutline color="success" /></ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Section>
          </Grid>
        )}
        {trip.exclusions?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Section title="What's Not Included">
              <List dense>
                {trip.exclusions.map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemIcon sx={{minWidth: 36}}><HighlightOff color="error" /></ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Section>
          </Grid>
        )}
      </Grid>

      {/* Itinerary */}
      {trip.itineraries?.length > 0 && (
        <Section title="Daily Itinerary">
          <Stack spacing={2}>
            {trip.itineraries.map((day, index) => (
              <Accordion key={index} sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: 'none', 
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="600" color="primary.main">{day.dayTitle || `Day ${index + 1}`}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {day.description || day.shortDescription}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
                    {day.highlights?.map((highlight, hIndex) => (
                      <Chip key={hIndex} label={highlight} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Section>
      )}
    </Stack>
  );
};

export default TripInfo;