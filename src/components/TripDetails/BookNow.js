// src/components/TripDetails/BookNow.js
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { BASE_URL, sheetProxy } from "../../endpoints";
import { getUserAuthHeader } from "../../utils";
import { useNotification } from "../../context/NotificationContext";

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const BookNow = ({ trip, onSuccess }) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [formData, setFormData] = React.useState({
    startDate: null,
    endDate: null,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    adultAttendees: "",
    childAttendees: "",
  });
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      !dayjs(formData.endDate).isAfter(dayjs(formData.startDate))
    ) {
      errors.endDate = "End date must be after the start date";
    }
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!PHONE_REGEX.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Enter a valid phone number (10–15 digits)";
    }
    if (formData.adultAttendees !== "" && Number(formData.adultAttendees) < 1) {
      errors.adultAttendees = "At least 1 adult is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      notify("Please fix the highlighted fields", "warning");
      return;
    }

    setLoading(true);
    try {
      // Save booking to backend when the user is logged in.
      const authHeader = getUserAuthHeader();
      if (authHeader.Authorization) {
        await fetch(`${BASE_URL}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
          body: JSON.stringify({
            tripId: trip._id,
            startDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
            attendees: {
              adults: formData.adultAttendees || 0,
              children: formData.childAttendees || 0,
            },
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        });
      }

      // Send booking data to Google Sheets via the backend proxy.
      // NOTE: the GAS secret should be moved server-side; the sheets proxy
      // should attach it instead of the client (requires backend change).
      const sheetsResponse = await fetch(sheetProxy, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          secret: process.env.REACT_APP_GAS_SECRET,
          startDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
          adultAttendees: formData.adultAttendees || 0,
          childAttendees: formData.childAttendees || 0,
          tripName: trip.name,
        }),
      });

      if (!sheetsResponse.ok) throw new Error("Failed to save booking");

      if (onSuccess) onSuccess();
      navigate("/booking-confirmation", {
        state: {
          success: true,
          bookingData: {
            ...formData,
            tripName: trip.name,
            startDate: dayjs(formData.startDate).format("DD MMM YYYY"),
            endDate: dayjs(formData.endDate).format("DD MMM YYYY"),
            adults: formData.adultAttendees || 0,
            children: formData.childAttendees || 0,
          },
        },
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      navigate("/booking-confirmation", { state: { success: false } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: "15px",
        p: 3,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        Book Your Trip
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate && dayjs(formData.startDate)}
                onChange={(date) => handleChange("startDate", date)}
                minDate={dayjs().add(1, "day")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    size: "small",
                    error: Boolean(fieldErrors.startDate),
                    helperText: fieldErrors.startDate,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate && dayjs(formData.endDate)}
                onChange={(date) => handleChange("endDate", date)}
                minDate={
                  formData.startDate
                    ? dayjs(formData.startDate).add(1, "day")
                    : dayjs().add(2, "day")
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    size: "small",
                    error: Boolean(fieldErrors.endDate),
                    helperText: fieldErrors.endDate,
                  },
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={Boolean(fieldErrors.firstName)}
              helperText={fieldErrors.firstName}
              fullWidth
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={Boolean(fieldErrors.lastName)}
              helperText={fieldErrors.lastName}
              fullWidth
              required
              size="small"
            />
          </Grid>
        </Grid>

        <TextField
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          error={Boolean(fieldErrors.phoneNumber)}
          helperText={fieldErrors.phoneNumber}
          fullWidth
          required
          size="small"
          sx={{ mt: 2 }}
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Adults"
              type="number"
              value={formData.adultAttendees}
              onChange={(e) => handleChange("adultAttendees", e.target.value)}
              error={Boolean(fieldErrors.adultAttendees)}
              helperText={fieldErrors.adultAttendees}
              fullWidth
              size="small"
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Children"
              type="number"
              value={formData.childAttendees}
              onChange={(e) => handleChange("childAttendees", e.target.value)}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          disabled={loading}
          sx={{ mt: 3, width: "100%", py: 1.5 }}
        >
          {loading ? "Submitting…" : "Book Now"}
        </Button>
      </Box>
    </Card>
  );
};

export default BookNow;
