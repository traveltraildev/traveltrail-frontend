// src/api/bookingAPI.js
import { BASE_URL } from '../endpoints';
import { getAuthHeader } from '../utils';

export const getUserBookingHistory = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/bookings/history`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    if (!response.ok) throw new Error('Failed to fetch booking history');
    return await response.json();
  } catch (error) {
    console.error('Error in getUserBookingHistory:', error);
    throw error;
  }
};