import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Container,
  Alert,
  AlertTitle,
  Stack
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import { useAuth } from '../context/AuthContext';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const { isAuthenticated } = useAuth();
  const success = state?.success;
  const bookingData = state?.bookingData || {};

  const whatsappMessage = `*Booking Inquiry*
---------------------
*Trip Name:* ${bookingData.tripName}
*Name:* ${bookingData.firstName} ${bookingData.lastName}
*Email:* ${bookingData.email}
*Phone:* ${bookingData.phone}
*Dates:* ${bookingData.startDate} - ${bookingData.endDate}
*Guests:* ${bookingData.adults} Adults, ${bookingData.children} Children
---------------------
I'd like to confirm the availability and get a quote for this trip.`;

  return (
    <>
    <Navbar />
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        {success ? (
          <Stack alignItems="center" spacing={3}>
            <CheckCircleOutlineIcon sx={{ fontSize: 70, color: 'success.main' }} />
            <Typography variant="h4" component="h1" fontWeight="600" sx={{ textAlign: 'center' }}>
              Thank You for Your Inquiry!
            </Typography>
            <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
              We have received your request and are checking the availability for your selected dates.
            </Typography>
            
            <Divider sx={{ width: '100%', my: 2 }} />

            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom fontWeight="500">Your Inquiry Summary</Typography>
                <Stack spacing={1.5} sx={{p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2}}>
                    <Grid container>
                        <Grid item xs={4}><Typography variant="body1" color="text.secondary">Trip:</Typography></Grid>
                        <Grid item xs={8}><Typography variant="body1" fontWeight="500">{bookingData.tripName}</Typography></Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={4}><Typography variant="body1" color="text.secondary">Dates:</Typography></Grid>
                        <Grid item xs={8}><Typography variant="body1" fontWeight="500">{bookingData.startDate} to {bookingData.endDate}</Typography></Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={4}><Typography variant="body1" color="text.secondary">Guests:</Typography></Grid>
                        <Grid item xs={8}><Typography variant="body1" fontWeight="500">{bookingData.adults} Adults, {bookingData.children} Children</Typography></Grid>
                    </Grid>
                </Stack>
            </Box>

            <Alert severity="info" sx={{ width: '100%', mt: 2 }}>
              <AlertTitle>What Happens Next?</AlertTitle>
              One of our travel experts will contact you via email or phone within the next **24 hours** with a detailed quote and confirmation of availability. 
            </Alert>

            {!isAuthenticated && (
              <Box sx={{ width: '100%', textAlign: 'center', mt: 4, p: 3, backgroundColor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>Save Your Details for Next Time!</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Create an account to track your bookings, save your details, and get access to exclusive deals.</Typography>
                <Button component={Link} to="/register" variant="contained">Create Account</Button>
              </Box>
            )}

            <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
              Have urgent questions? Chat with us now!
            </Typography>

            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<WhatsAppIcon />}
              href={`https://wa.me/917060400357?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
            >
              Chat on WhatsApp
            </Button>

          </Stack>
        ) : (
          <Stack alignItems="center" spacing={3}>
            <ErrorOutlineIcon sx={{ fontSize: 70, color: 'error.main' }} />
            <Typography variant="h4" component="h1" fontWeight="600">
              Oops! Something went wrong.
            </Typography>
            <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
              We couldn't process your booking request at the moment. Please try again later or contact us directly.
            </Typography>
            <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
              Go to Homepage
            </Button>
          </Stack>
        )}
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            If you have any immediate questions, feel free to call us at <a href="tel:+919808007842">+91 98080 07842</a> or email us at <a href="mailto:info@traveltrail.com">info@traveltrail.com</a>.
        </Typography>
      </Paper>
    </Container>
    <Footer />
    </>
  );
};

export default BookingConfirmation;