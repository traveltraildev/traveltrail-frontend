// src/components/admin/bookings/useBookings.js
import { useCallback, useEffect, useState } from 'react';
import { fetchBookings } from './bookingsApi';
import { todayIsoDate } from './bookingsUtils';

const REFRESH_INTERVAL_MS = 30000;

/**
 * Data hook for the admin bookings dashboard. Owns loading/error state and
 * all booking mutations. Mutations are applied locally, matching the
 * behaviour of the original page (no write endpoints exist on the backend
 * yet — wire them up here when they do).
 */
export default function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null); // 'live' | 'sample'
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { bookings: rows, source: dataSource } = await fetchBookings();
      setBookings(rows);
      setSource(dataSource);
      setLastUpdated(new Date());
    } catch (err) {
      setError('We could not load the bookings. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Tick the "last updated" timestamp every 30s (kept from the original page).
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const patchBooking = useCallback((id, patch) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? { ...booking, ...(typeof patch === 'function' ? patch(booking) : patch) }
          : booking
      )
    );
  }, []);

  const updateStatus = useCallback(
    (id, status) => patchBooking(id, { status, lastContact: todayIsoDate() }),
    [patchBooking]
  );

  const updateTemperature = useCallback(
    (id, temperature) => patchBooking(id, { temperature }),
    [patchBooking]
  );

  const updateAgent = useCallback(
    (id, agent) => patchBooking(id, { agent }),
    [patchBooking]
  );

  const updateAnnotation = useCallback(
    (id, annotations) => patchBooking(id, { annotations }),
    [patchBooking]
  );

  const addCommunication = useCallback(
    (id, entry) =>
      patchBooking(id, (booking) => ({
        communications: [entry, ...(booking.communications || [])],
        lastContact: todayIsoDate(),
      })),
    [patchBooking]
  );

  const bulkMarkContacted = useCallback((ids) => {
    const idSet = new Set(ids);
    setBookings((prev) =>
      prev.map((booking) =>
        idSet.has(booking.id)
          ? { ...booking, status: 'contacted', lastContact: todayIsoDate() }
          : booking
      )
    );
  }, []);

  return {
    bookings,
    loading,
    error,
    source,
    lastUpdated,
    refresh: load,
    updateStatus,
    updateTemperature,
    updateAgent,
    updateAnnotation,
    addCommunication,
    bulkMarkContacted,
  };
}
