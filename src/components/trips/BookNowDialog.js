// src/components/trips/BookNowDialog.js — modal wrapper around the BookNow form.
import React from "react";
import { Box, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BookNow from "../TripDetails/BookNow";

const BookNowDialog = ({ trip, onClose }) => (
  <Dialog
    open={Boolean(trip)}
    onClose={onClose}
    fullWidth
    maxWidth="md"
    aria-label={trip ? `Book ${trip.name}` : "Book trip"}
    PaperProps={{
      sx: {
        borderRadius: "16px",
        overflow: "visible",
        bgcolor: "background.paper",
      },
    }}
  >
    <Box sx={{ position: "absolute", right: 16, top: 16, zIndex: 1 }}>
      <IconButton
        onClick={onClose}
        aria-label="Close booking dialog"
        sx={{ color: "primary.main" }}
      >
        <CloseIcon />
      </IconButton>
    </Box>

    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {trip && <BookNow trip={trip} onSuccess={onClose} />}
    </Box>
  </Dialog>
);

export default BookNowDialog;
