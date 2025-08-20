import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Stack,
  Alert,
  Divider,
  useTheme
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { BASE_URL } from '../../endpoints';
import { getUserAuthHeader } from "../../utils";

const BookNow = ({ trip }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setError('');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      setError('Please select a start and end date.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const apiResponse = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getUserAuthHeader() },
        body: JSON.stringify({
          tripId: trip._id,
          startDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
          attendees: {
            adults: Number(formData.adults) || 1,
            children: Number(formData.children) || 0,
          }
        })
      });

      if (!apiResponse.ok) throw new Error("Failed to save booking. Please try again.");

      navigate("/booking-confirmation", {
        state: {
          success: true,
          bookingData: {
            tripName: trip.name,
            startDate: dayjs(formData.startDate).format("DD MMM YYYY"),
            endDate: dayjs(formData.endDate).format("DD MMM YYYY"),
            adults: Number(formData.adults) || 1,
            children: Number(formData.children) || 0,
          },
        },
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = trip.price * formData.adults;

  return (
    <Paper elevation={12} sx={{ p: {xs: 2.5, md: 3.5}, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
      <Stack spacing={3}>
        <Box>
            <Typography variant="h4" fontWeight="700">Book Your Trip</Typography>
            <Typography color="text.secondary">Starting from <Typography component="span" fontWeight="700" color="primary">₹{trip.price?.toLocaleString()}</Typography>/person</Typography>
        </Box>
        <Divider />
        <Box component="form" onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleChange("startDate", date)}
                minDate={dayjs().add(1, "day")}
                sx={{width: '100%'}}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => handleChange("endDate", date)}
                minDate={formData.startDate ? dayjs(formData.startDate).add(1, "day") : dayjs().add(2, "day")}
                sx={{width: '100%'}}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Adults"
                  type="number"
                  value={formData.adults}
                  onChange={(e) => handleChange("adults", e.target.value)}
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <TextField
                  label="Children"
                  type="number"
                  value={formData.children}
                  onChange={(e) => handleChange("children", e.target.value)}
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Stack>
              <Divider sx={{pt: 1}}/>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="600">Total Price:</Typography>
                <Typography variant="h5" fontWeight="700" color="primary">₹{totalPrice.toLocaleString()}</Typography>
              </Stack>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{py: 1.5}}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : "Request to Book"}
              </Button>
            </Stack>
          </LocalizationProvider>
        </Box>
      </Stack>
    </Paper>
  );
};

export default BookNow;