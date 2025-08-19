import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Stack,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import { Delete as DeleteIcon, AddCircleOutline } from "@mui/icons-material";

const ItineraryDayForm = ({
  dayIndex,
  dayData,
  onChangeDayData,
  onAddHighlight,
  onRemoveHighlight,
  onDeleteDay,
}) => {
  const [highlightText, setHighlightText] = useState("");

  const handleAddHighlightClick = () => {
    if (highlightText.trim() !== "") {
      onAddHighlight(dayIndex, highlightText.trim());
      setHighlightText("");
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: 3, mb: 3, borderRadius: 2 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" component="div">Day {dayIndex + 1}</Typography>
        <Tooltip title="Delete Day">
          <IconButton onClick={() => onDeleteDay(dayIndex)} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Day Title"
            fullWidth
            value={dayData.dayTitle || ''}
            onChange={(e) => onChangeDayData(dayIndex, { ...dayData, dayTitle: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Short Description"
            fullWidth
            value={dayData.shortDescription || ''}
            onChange={(e) => onChangeDayData(dayIndex, { ...dayData, shortDescription: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Detailed Description"
            fullWidth
            multiline
            rows={4}
            value={dayData.description || ''}
            onChange={(e) => onChangeDayData(dayIndex, { ...dayData, description: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
            Day Highlights
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', useFlexGap: true }}>
            {dayData.highlights?.map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => onRemoveHighlight(dayIndex, index)}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Add Highlight"
              size="small"
              fullWidth
              value={highlightText}
              onChange={(e) => setHighlightText(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlightClick(); }}}
            />
            <Button onClick={handleAddHighlightClick} variant="outlined" startIcon={<AddCircleOutline />}>
              Add
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ItineraryDayForm;
