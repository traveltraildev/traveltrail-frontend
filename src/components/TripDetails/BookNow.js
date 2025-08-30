
import React, { useState, useEffect } from 'react';
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
  useTheme,
  Grid,
  InputAdornment,
  Select,
  MenuItem
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { BASE_URL, sheetProxy } from '../../endpoints';
import { getUserAuthHeader } from "../../utils";
import { useAuth } from '../../context/AuthContext';
import { Person, Email, Phone, People } from '@mui/icons-material';

const countryCodes = [
    { code: '+91', label: 'IN' },
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    // Add more countries as needed
  ];

const BookNow = ({ item }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

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
    if (!isAuthenticated && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!formData.phone) {
        setError('Please fill in your phone number.');
        return;
    }
    setLoading(true);
    setError('');

    try {
        const isAccommodation = !!item.basePrice;

        const bookingData = {
            [isAccommodation ? 'accommodationId' : 'tripId']: item._id,
            startDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
            attendees: {
              adults: Number(formData.adults) || 1,
              children: Number(formData.children) || 0,
            },
            firstName: isAuthenticated ? user.firstName : formData.firstName,
            lastName: isAuthenticated ? user.lastName : formData.lastName,
            email: isAuthenticated ? user.email : formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
          };

      if (isAuthenticated) {
        bookingData.userId = user._id;
      }

      const headers = {
        "Content-Type": "application/json",
      };

      if (isAuthenticated) {
        Object.assign(headers, getUserAuthHeader());
      }

      // Save booking to the database
      const apiResponse = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bookingData)
      });

      if (!apiResponse.ok) throw new Error("Failed to save booking. Please try again.");

      // Send booking data to Google Sheets
      const sheetsResponse = await fetch(sheetProxy, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          secret: process.env.REACT_APP_GAS_SECRET,
          itemName: item.name,
        }),
      });

      if (!sheetsResponse.ok) {
        // Log the error but don't block the user
        console.error("Failed to save booking to Google Sheets");
      }


      navigate("/booking-confirmation", {
        state: {
          success: true,
          bookingData: {
            itemName: item.name,
            startDate: dayjs(formData.startDate).format("DD MMM YYYY"),
            endDate: dayjs(formData.endDate).format("DD MMM YYYY"),
            adults: Number(formData.adults) || 1,
            children: Number(formData.children) || 0,
            firstName: isAuthenticated ? user.firstName : formData.firstName,
            lastName: isAuthenticated ? user.lastName : formData.lastName,
            email: isAuthenticated ? user.email : formData.email,
            phone: `${formData.countryCode} ${formData.phone}`
          },
        },
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    const isAccommodation = !!item.basePrice;
    if (isAccommodation) {
      const { basePrice, baseOccupancy, extraAdultFee, extraChildFee } = item;
      const { adults, children } = formData;

      let total = basePrice;
      const totalGuests = adults + children;

      if (totalGuests > baseOccupancy) {
        const extraAdults = Math.max(0, adults - baseOccupancy);
        total += extraAdults * extraAdultFee;
        total += children * extraChildFee;
      }

      return total;
    }
    return item.price * formData.adults;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <Paper elevation={12} sx={{ p: {xs: 2.5, md: 3.5}, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
      <Stack spacing={3}>
        <Box>
            <Typography variant="h4" fontWeight="700">Enquire Now</Typography>
            <Typography color="text.secondary">Starting from <Typography component="span" fontWeight="700" color="primary">₹{item.basePrice?.toLocaleString() || item.price?.toLocaleString()}</Typography>{item.basePrice ? '/night' : '/person'}</Typography>
        </Box>
        <Divider />
        <Box component="form" onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                </Grid>
                {!isAuthenticated && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Person /></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Email /></InputAdornment>,
                                }}
                            />
                        </Grid>
                    </>
                )}
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <Select
                            value={formData.countryCode}
                            onChange={(e) => handleChange("countryCode", e.target.value)}
                            sx={{width: 100}}
                        >
                            {countryCodes.map((country) => (
                                <MenuItem key={country.code} value={country.code}>
                                    {country.label} ({country.code})
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            fullWidth
                            required
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>,
                            }}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(date) => handleChange("startDate", date)}
                        minDate={dayjs().add(1, "day")}
                        sx={{width: '100%'}}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DatePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(date) => handleChange("endDate", date)}
                        minDate={formData.startDate ? dayjs(formData.startDate).add(1, "day") : dayjs().add(2, "day")}
                        sx={{width: '100%'}}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    label="Adults"
                    type="number"
                    value={formData.adults}
                    onChange={(e) => handleChange("adults", e.target.value)}
                    fullWidth
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><People /></InputAdornment>,
                        inputProps: { min: 1 } 
                    }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    label="Children"
                    type="number"
                    value={formData.children}
                    onChange={(e) => handleChange("children", e.target.value)}
                    fullWidth
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><People /></InputAdornment>,
                        inputProps: { min: 0 } 
                    }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{pt: 1}}/>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" fontWeight="600">Total Price:</Typography>
                        <Typography variant="h4" fontWeight="700" color="primary">₹{totalPrice.toLocaleString()}</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        fullWidth
                        sx={{py: 1.5, fontSize: '1.2rem', fontWeight: 'bold'}}
                    >
                        {loading ? <CircularProgress size={26} color="inherit" /> : "Check Availability"}
                    </Button>
                </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      </Stack>
    </Paper>
  );
};

export default BookNow;
