import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { useAuth } from '@clerk/clerk-react';
import { getUserBookingHistory } from '../../api/bookingAPI';
import { format } from 'date-fns';

const UserBookingHistory = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setLoading(false);
        setError("User ID is not available.");
        return;
      }
      try {
        const token = await getToken();
        const data = await getUserBookingHistory(token);
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch booking history.");
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId, getToken]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const getStatusColor = (status) => {
      switch(status?.toLowerCase()) {
          case 'confirmed': return 'success';
          case 'pending': return 'warning';
          case 'cancelled': return 'error';
          default: return 'default';
      }
  }

  return (
    <Box>
      {bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 6, border: `2px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            You have no bookings yet.
          </Typography>
          <Typography color="text.secondary" sx={{mt: 1}}>When you book a trip, it will appear here.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{borderRadius: 2}}>
          <Table aria-label="booking history table">
            <TableHead sx={{ bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <TableRow>
                <TableCell sx={{fontWeight: 'bold'}}>Trip Name</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Dates</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{booking.tripName}</TableCell>
                  <TableCell>{`${format(new Date(booking.startDate), 'dd MMM yyyy')} - ${format(new Date(booking.endDate), 'dd MMM yyyy')}`}</TableCell>
                  <TableCell>
                    <Chip label={booking.status || 'Confirmed'} color={getStatusColor(booking.status)} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserBookingHistory;