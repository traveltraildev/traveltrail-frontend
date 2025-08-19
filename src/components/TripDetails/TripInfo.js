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
  Grid
} from '@mui/material';
import { ExpandMore, CheckCircleOutline, HighlightOff } from '@mui/icons-material';

const Section = ({ title, children }) => (
  <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'neutral.200' }}>
    <Typography variant="h5" component="h2" fontWeight="600" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const TripInfo = ({ trip }) => {
  if (!trip) {
    return null; // Or a loading skeleton
  }

  return (
    <Stack spacing={3}>
      {/* Overview */}
      <Section title="Overview">
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {trip.desc}
        </Typography>
      </Section>

      {/* Themes */}
      {trip.themes?.length > 0 && (
        <Section title="Themes">
          <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
            {trip.themes.map((theme) => (
              <Chip key={theme} label={theme} color="primary" variant="outlined" />
            ))}
          </Stack>
        </Section>
      )}

      {/* Inclusions & Exclusions */}
      <Grid container spacing={3}>
        {trip.inclusions?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Section title="What's Included">
              <List dense>
                {trip.inclusions.map((item) => (
                  <ListItem key={item} disableGutters>
                    <ListItemIcon sx={{minWidth: 32}}><CheckCircleOutline color="success" fontSize="small" /></ListItemIcon>
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
                    <ListItemIcon sx={{minWidth: 32}}><HighlightOff color="error" fontSize="small" /></ListItemIcon>
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
          <Stack spacing={1.5}>
            {trip.itineraries.map((day, index) => (
              <Accordion key={index} sx={{ border: '1px solid', borderColor: 'neutral.200', boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="600">{day.dayTitle || `Day ${index + 1}`}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {day.shortDescription}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
                    {day.highlights?.map((highlight, hIndex) => (
                      <Chip key={hIndex} label={highlight} size="small" />
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
