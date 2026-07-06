// src/components/admin/bookings/bookingsApi.js
import { BASE_URL } from '../../../endpoints';
import { getAdminAuthHeader } from '../../../utils';
import { SAMPLE_BOOKINGS } from './sampleBookings';

const ADMIN_BOOKINGS_ENDPOINT = `${BASE_URL}/api/admin/bookings`;

const normalizeBookings = (data) => {
  const rows = Array.isArray(data) ? data : data?.bookings || [];
  return rows.map((row, index) => ({
    communications: [],
    ...row,
    id: row.id ?? row._id ?? `BK${index + 1}`,
  }));
};

/**
 * Loads bookings for the admin dashboard.
 *
 * The backend does not implement /api/admin/bookings yet — the original page
 * shipped with hardcoded sample leads and made no API calls at all. To keep
 * the dashboard usable (and behaviour unchanged) we try the live endpoint
 * first and fall back to the sample dataset when it is unavailable. Delete
 * the fallback once the endpoint exists.
 */
export const fetchBookings = async () => {
  try {
    const response = await fetch(ADMIN_BOOKINGS_ENDPOINT, {
      headers: { ...getAdminAuthHeader() },
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return { bookings: normalizeBookings(data), source: 'live' };
  } catch (error) {
    return { bookings: SAMPLE_BOOKINGS, source: 'sample' };
  }
};
