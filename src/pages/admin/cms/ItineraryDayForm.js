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
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

const ItineraryDayForm = ({
  dayIndex,
  dayData,
  onChangeDayData,
  onAddHighlight,
  onRemoveHighlight,
  onDeleteDay,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [highlightText, setHighlightText] = useState("");
  const [highlightOptions] = useState([]);

  const handleAddHighlightClick = () => {
    if (highlightText.trim() !== "") {
      onAddHighlight(dayIndex, highlightText.trim());
      setHighlightText("");
    }
  };

  const handleRemoveHighlightClick = (index) => {
    onRemoveHighlight(dayIndex, index);
  };

  const handleTitleChange = (e) => {
    const prefix = `Day ${dayIndex + 1}: `;
    const newValue = e.target.value.startsWith(prefix)
      ? e.target.value
      : `${prefix}${e.target.value}`;
    
    onChangeDayData(dayIndex, {
      ...dayData,
      dayTitle: newValue,
    });
  };

  const displayedTitle = dayData.dayTitle?.replace(`Day ${dayIndex + 1}: `, "") || "";

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: theme.palette.divider,
        borderRadius: 2,
        p: 3,
        mb: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" component="div">
          Day {dayIndex + 1}
        </Typography>
        <Button
          variant="contained"
          color="error"
          size={isMobile ? "small" : "medium"}
          onClick={() => onDeleteDay(dayIndex)}
          startIcon={<DeleteIcon />}
        >
          Delete Day
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Day Title"
            fullWidth
            variant="outlined"
            value={displayedTitle}
            onChange={handleTitleChange}
            helperText="The prefix 'Day X' will be automatically added"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Short Description"
            fullWidth
            variant="outlined"
            value={dayData.shortDescription || ""}
            onChange={(e) =>
              onChangeDayData(dayIndex, {
                ...dayData,
                shortDescription: e.target.value,
              })
            }
            helperText="Brief summary (max 150 characters)"
            inputProps={{ maxLength: 150 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Detailed Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={dayData.description || ""}
            onChange={(e) =>
              onChangeDayData(dayIndex, {
                ...dayData,
                description: e.target.value,
              })
            }
            helperText="Full itinerary details for this day"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
            Day Highlights
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {dayData.highlights?.map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => handleRemoveHighlightClick(index)}
                deleteIcon={
                  <DeleteIcon sx={{ "&:hover": { color: theme.palette.error.dark } }} />
                }
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  "& .MuiChip-deleteIcon": { color: theme.palette.error.main },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Autocomplete
              freeSolo
              fullWidth
              options={highlightOptions}
              getOptionLabel={(option) => option}
              inputValue={highlightText}
              onInputChange={(_, newValue) => setHighlightText(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add Highlight"
                  variant="outlined"
                  helperText="Press Enter to add"
                />
              )}
              onKeyPress={(e) => e.key === "Enter" && handleAddHighlightClick()}
            />
            <Button
              variant="contained"
              onClick={handleAddHighlightClick}
              sx={{ height: 56 }}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItineraryDayForm;
// --- END OF FILE src/components/admin/cms/ItineraryDayForm.js ---