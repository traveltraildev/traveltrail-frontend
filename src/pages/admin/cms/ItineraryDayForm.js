// --- START OF FILE src/components/admin/cms/ItineraryDayForm.js ---
import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Autocomplete,
} from "@mui/material"; // Import Autocomplete and Chip
import DeleteIcon from "@mui/icons-material/Delete";

const ItineraryDayForm = ({
  dayIndex,
  dayData,
  onChangeDayData,
  onAddHighlight,
  onRemoveHighlight,
  onDeleteDay,
}) => {
  const [highlightText, setHighlightText] = useState(""); // Local state for highlight input - KEEP
  const [highlightOptions, setHighlightOptions] = useState([]); // Options for Autocomplete - NEW

  const handleAddHighlightClick = () => {
    // No need for event parameter here
    if (highlightText.trim() !== "") {
      onAddHighlight(dayIndex, highlightText.trim()); // Call onAddHighlight with CORRECT highlightText state value
      setHighlightText(""); // Clear the highlight input field after adding
    }
  };

  const handleRemoveHighlightClick = (dayIndex, index) => {
    onRemoveHighlight(dayIndex, index);
  };

  return (
    <Box
      className="card p-4 mt-4"
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 3,
        marginBottom: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Day {dayIndex + 1}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Day Title"
            fullWidth
            variant="outlined"
            name="dayTitle"
            value={dayData.dayTitle || ""}
            onChange={(e) =>
              onChangeDayData(dayIndex, {
                ...dayData,
                dayTitle: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Short Description"
            fullWidth
            variant="outlined"
            name="shortDescription"
            value={dayData.shortDescription || ""}
            onChange={(e) =>
              onChangeDayData(dayIndex, {
                ...dayData,
                shortDescription: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            name="description"
            value={dayData.description || ""}
            onChange={(e) =>
              onChangeDayData(dayIndex, {
                ...dayData,
                description: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          {" "}
          {/* Day Highlights Section - Takes full width now - RENAMED SECTION */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Day Highlights
          </Typography>{" "}
          {/* RENAMED SECTION TITLE */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {" "}
            {/* Flexbox for Autocomplete and Button */}
            <Autocomplete
              freeSolo
              options={highlightOptions}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Day Highlights"
                  variant="outlined"
                />
              )}
              inputValue={highlightText}
              onInputChange={(event, newValue) => setHighlightText(newValue)}
              fullWidth
              name="highlight"
            />
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={handleAddHighlightClick}
            >
              Add Day Highlight {/* RENAMED Button Label */}
            </Button>
          </Box>
          {/* Display Day highlights for this day - Styled Typography tags */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {dayData.highlights &&
              dayData.highlights.map((item, index) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#1976d2",
                    width: "50%",
                    padding: "5px 30px",
                    marginBottom: "6px",
                  }}
                >
                  <Typography key={index} variant="body2">
                    {item}
                  </Typography>
                  <DeleteIcon
                    sx={{ color: "#d32f2f" }}
                    onClick={() => handleRemoveHighlightClick(dayIndex, index)}
                  />
                </Box>
              ))}
          </Box>
        </Grid>

        {/* **REMOVED Inclusions Section** */}
        {/* **REMOVED Exclusions Section** */}
      </Grid>
      <Button
        variant="contained"
        color="error"
        sx={{ mt: 2 }}
        onClick={() => onDeleteDay(dayIndex)}
      >
        Delete Day {dayIndex + 1}
      </Button>
    </Box>
  );
};

export default ItineraryDayForm;
// --- END OF FILE src/components/admin/cms/ItineraryDayForm.js ---
