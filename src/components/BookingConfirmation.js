import { useLocation } from 'react-router-dom';
import { Box, Typography, Button, Grid } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const bookingData = state?.bookingData || {};

  const whatsappMessage = `*Booking Confirmation*
📌 Trip: ${bookingData.tripName}
👤 Name: ${bookingData.firstName} ${bookingData.lastName}
📞 Phone: ${bookingData.phoneNumber}
🗓 Dates: ${bookingData.startDate} - ${bookingData.endDate}
👥 Attendees: ${bookingData.adults} Adults, ${bookingData.children} Children`;

  return (
    <Box sx={{ textAlign: 'center', p: 4, mt: 4 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Booking Received!
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        We will contact you shortly to confirm your booking.
      </Typography>

      <Grid container justifyContent="center" spacing={3}>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsAppIcon />}
            href={`https://wa.me/917060400357?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            sx={{ px: 4, py: 2 }}
          >
            Chat Now on WhatsApp
          </Button>
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
        Prefer another method? Call us at +91 98080 07842
      </Typography>
    </Box>
  );
};

export default BookingConfirmation;