// src/components/common/UserBookingHistory.js
import { useState, useEffect } from 'react';
import { getUserBookingHistory } from '../../api/bookingAPI';

const UserBookingHistory = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookingHistory(userId);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  return (
    <div className="user-booking-history">
      <h2>Booking History</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Trip</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.tripName}</td>
                <td>{`${booking.startDate} - ${booking.endDate}`}</td>
                <td>{booking.status || 'Confirmed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserBookingHistory;