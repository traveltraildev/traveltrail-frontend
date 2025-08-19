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
  Alert
} from '@mui/material';
import { getUserBookingHistory } from '../../api/bookingAPI';

const UserBookingHistory = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setLoading(false);
        setError("User ID is not available.");
        return;
      }
      try {
        const data = await getUserBookingHistory(userId);
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch booking history.");
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

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

  return (
    <Box>
      {bookings.length === 0 ? (
        <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
          You have no bookings yet.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table aria-label="booking history table">
            <TableHead sx={{ bgcolor: 'neutral.100' }}>
              <TableRow>
                <TableCell>Trip Name</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{booking.tripName}</TableCell>
                  <TableCell>{`${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`}</TableCell>
                  <TableCell>
                    <Chip label={booking.status || 'Confirmed'} color="success" size="small" />
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
