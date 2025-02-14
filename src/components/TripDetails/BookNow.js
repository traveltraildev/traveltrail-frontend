// --- START OF FILE BookNow.js ---
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import React from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

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

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Card elevation={2} sx={{ borderRadius: "15px" }}> {/* Reduced elevation */}
      <CardContent sx={{ padding: "16px" }}> {/* Reduced CardContent padding */}
        <Box sx={{ padding: "16px" }}> {/* Reduced Box padding */}
          

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 1, fontSize: "1.1rem" }} // Reduced mb, fontSize
          >
            Booking Form
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 600,
              mx: "auto",
              gap: 1.5, // Reduced gap
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 0.5, // Reduced mb
                fontWeight: "bold",
                fontSize: "0.9rem" // Reduced form section title font
              }}
            >
              Date
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={formData.startDate ? dayjs(formData.startDate) : null}
                    onChange={(date) => handleChange("startDate", date ? date.format('YYYY-MM-DD') : null)}
                    textField={(params) => <TextField {...params} size="small" fullWidth variant="outlined" />} // size="small" TextField
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To"
                    value={formData.endDate ? dayjs(formData.endDate) : null}
                    onChange={(date) => handleChange("endDate",  date ? date.format('YYYY-MM-DD') : null)}
                    textField={(params) => <TextField {...params} size="small" fullWidth variant="outlined" />} // size="small" TextField
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0.5, // Reduced mb
                mt: 1.5, // Reduced mt
                fontWeight: "bold",
                fontSize: "0.9rem" // Reduced form section title font
              }}
            >
              Name
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small" // size="small" TextField
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small" // size="small" TextField
                />
              </Grid>
            </Grid>

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0.5, // Reduced mb
                mt: 1.5, // Reduced mt
                fontWeight: "bold",
                fontSize: "0.9rem" // Reduced form section title font
              }}
            >
              Phone
            </Typography>
            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              fullWidth
              variant="outlined"
              size="small" // size="small" TextField
            />

            <Typography
              variant="subtitle1"
              sx={{
                mb: 0.5, // Reduced mb
                mt: 1.5, // Reduced mt
                fontWeight: "bold",
                fontSize: "0.9rem" // Reduced form section title font
              }}
            >
              No. of Attendees
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Adult Attendees"
                  type="number"
                  value={formData.adultAttendees}
                  onChange={(e) => handleChange("adultAttendees", e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small" // size="small" TextField
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Child Attendees"
                  type="number"
                  value={formData.childAttendees}
                  onChange={(e) => handleChange("childAttendees", e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small" // size="small" TextField
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small" // size="small" Button
              sx={{
                backgroundColor: "#33bfff",
                marginTop: "16px", // Reduced marginTop
                "&:hover": {
                  backgroundColor: "#00a2e8",
                },
                fontSize: "0.9rem" // Reduced button font size
              }}
              fullWidth
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookNow;
// --- END OF FILE BookNow.js ---