// --- BookNow.js ---
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const BookNow = ({ trip }) => {
  const [formData, setFormData] = React.useState({
    startDate: null,
    endDate: null,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    adultAttendees: "",
    childAttendees: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || 
        !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }
  
    // Prepare WhatsApp message FIRST
    const message = `*New Booking*
  📌 *Trip:* ${trip.name}
  👤 *Name:* ${formData.firstName} ${formData.lastName}
  📞 *Contact:* ${formData.phoneNumber}
  🗓 *Dates:* ${dayjs(formData.startDate).format('DD MMM')}-${dayjs(formData.endDate).format('DD MMM YYYY')}
  👥 *Attendees:* ${formData.adultAttendees || 0} Adults, ${formData.childAttendees || 0} Kids`;
  
    try {
      // SILENT Google Sheets submission
      fetch('/api/sheets-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: dayjs(formData.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(formData.endDate).format('YYYY-MM-DD'),
          adultAttendees: formData.adultAttendees || 0,
          childAttendees: formData.childAttendees || 0,
          tripName: trip.name
        })
      }).catch(error => console.error('Sheets submission error:', error)); // Silent error logging
  
      // IMMEDIATE WhatsApp redirect
      window.open(`https://wa.me/919808007842?text=${encodeURIComponent(message)}`, '_blank');
  
      // Reset form
      setFormData({
        startDate: null,
        endDate: null,
        firstName: "",
        lastName: "",
        phoneNumber: "",
        adultAttendees: "",
        childAttendees: "",
      });
  
    } catch (error) {
      console.error('Unexpected error:', error);
      // Fallback: Still open WhatsApp even if something unexpected happens
      window.open(`https://wa.me/919808007842?text=${encodeURIComponent(message)}`, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={2} sx={{ borderRadius: "15px" }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Book Your Trip
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate && dayjs(formData.startDate)}
                    onChange={date => handleChange("startDate", date)}
                    minDate={dayjs().add(1, 'day')}
                    slotProps={{ textField: { fullWidth: true, required: true, size: 'small' } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate && dayjs(formData.endDate)}
                    onChange={date => handleChange("endDate", date)}
                    minDate={formData.startDate ? dayjs(formData.startDate).add(1, 'day') : dayjs().add(2, 'day')}
                    slotProps={{ textField: { fullWidth: true, required: true, size: 'small' } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={e => handleChange("firstName", e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={e => handleChange("lastName", e.target.value)}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
            </Grid>

            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={e => handleChange("phoneNumber", e.target.value)}
              fullWidth
              required
              size="small"
              sx={{ mt: 2 }}
              inputProps={{ pattern: "[+0-9]{10,15}" }}
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  label="Adults"
                  type="number"
                  value={formData.adultAttendees}
                  onChange={e => handleChange("adultAttendees", e.target.value)}
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
                  onChange={e => handleChange("childAttendees", e.target.value)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WhatsAppIcon />}
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: '#25D366',
                '&:hover': { bgcolor: '#128C7E' },
                width: '100%'
              }}
            >
              {loading ? 'Submitting...' : 'Confirm via WhatsApp'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookNow;