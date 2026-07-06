// src/pages/ManageBookingsPage.js
// Admin bookings/leads dashboard. Orchestrates the components in
// src/components/admin/bookings/ — data fetching lives in useBookings,
// presentation in BookingsToolbar / BookingsTable / BookingDetailsDialog.
import React, { useCallback, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNotification } from '../context/NotificationContext';
import useBookings from '../components/admin/bookings/useBookings';
import BookingsToolbar from '../components/admin/bookings/BookingsToolbar';
import BookingsTable from '../components/admin/bookings/BookingsTable';
import BookingDetailsDialog from '../components/admin/bookings/BookingDetailsDialog';
import { DEFAULT_FILTERS, STATUS_CONFIG } from '../components/admin/bookings/bookingsConfig';
import {
  bookingsToCsv,
  countByField,
  downloadCsv,
  filterBookings,
  todayIsoDate,
} from '../components/admin/bookings/bookingsUtils';

// The app-wide navbar is fixed and 68px tall; keep the page content clear of it.
const NAVBAR_CLEARANCE = '84px';

export default function ManageBookingsPage() {
  const { notify } = useNotification();
  const {
    bookings,
    loading,
    error,
    source,
    lastUpdated,
    refresh,
    updateStatus,
    updateTemperature,
    updateAgent,
    updateAnnotation,
    addCommunication,
    bulkMarkContacted,
  } = useBookings();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectionModel, setSelectionModel] = useState([]);
  const [detailsId, setDetailsId] = useState(null);
  const [showSourceNotice, setShowSourceNotice] = useState(true);

  const filteredBookings = useMemo(
    () => filterBookings(bookings, filters),
    [bookings, filters]
  );

  const statusCounts = useMemo(
    () => ({ all: bookings.length, ...countByField(bookings, 'status') }),
    [bookings]
  );

  const temperatureCounts = useMemo(
    () => countByField(bookings, 'temperature'),
    [bookings]
  );

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === detailsId) || null,
    [bookings, detailsId]
  );

  const handleFiltersChange = useCallback(
    (patch) => setFilters((prev) => ({ ...prev, ...patch })),
    []
  );

  const handleStatusChange = useCallback(
    (id, status) => {
      updateStatus(id, status);
      notify(`Status updated to "${STATUS_CONFIG[status]?.label ?? status}"`, 'success');
    },
    [updateStatus, notify]
  );

  const handleBulkMarkContacted = useCallback(() => {
    if (selectionModel.length === 0) return;
    bulkMarkContacted(selectionModel);
    notify(
      `${selectionModel.length} lead${selectionModel.length > 1 ? 's' : ''} marked as contacted`,
      'success'
    );
    setSelectionModel([]);
  }, [selectionModel, bulkMarkContacted, notify]);

  const handleAgentChange = useCallback(
    (id, agent) => {
      updateAgent(id, agent);
      notify(`Lead assigned to ${agent}`, 'success');
    },
    [updateAgent, notify]
  );

  const handleSaveAnnotation = useCallback(
    (id, annotations) => {
      updateAnnotation(id, annotations);
      notify('Notes saved', 'success');
    },
    [updateAnnotation, notify]
  );

  const handleAddCommunication = useCallback(
    (id, entry) => {
      addCommunication(id, entry);
      notify('Communication logged', 'success');
    },
    [addCommunication, notify]
  );

  const handleExportCsv = useCallback(() => {
    if (filteredBookings.length === 0) {
      notify('There are no bookings to export', 'info');
      return;
    }
    downloadCsv(bookingsToCsv(filteredBookings), `bookings-${todayIsoDate()}.csv`);
    notify(`Exported ${filteredBookings.length} bookings to CSV`, 'success');
  }, [filteredBookings, notify]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: NAVBAR_CLEARANCE,
        pb: 8,
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
        {/* Page header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Manage Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Track enquiries, follow up with customers and convert leads into bookings.
          </Typography>
        </Box>

        {source === 'sample' && showSourceNotice && (
          <Alert
            severity="info"
            sx={{ mb: 3 }}
            onClose={() => setShowSourceNotice(false)}
          >
            The live bookings API is not connected yet — showing sample data.
            Changes are kept locally in this session only.
          </Alert>
        )}

        <BookingsToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          statusCounts={statusCounts}
          temperatureCounts={temperatureCounts}
          selectedCount={selectionModel.length}
          onBulkMarkContacted={handleBulkMarkContacted}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
        />

        {error ? (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', borderRadius: 2 }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Couldn&apos;t load bookings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button variant="contained" startIcon={<RefreshIcon />} onClick={refresh}>
              Try Again
            </Button>
          </Paper>
        ) : (
          <BookingsTable
            bookings={filteredBookings}
            loading={loading}
            selectionModel={selectionModel}
            onSelectionModelChange={setSelectionModel}
            onStatusChange={handleStatusChange}
            onTemperatureChange={updateTemperature}
            onViewDetails={setDetailsId}
          />
        )}

        {/* Footer: result count + export */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ mt: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredBookings.length} of {bookings.length} leads
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCsv}
            disabled={loading}
            sx={{ minWidth: 140 }}
          >
            Export CSV
          </Button>
        </Stack>
      </Box>

      <BookingDetailsDialog
        open={Boolean(selectedBooking)}
        booking={selectedBooking}
        onClose={() => setDetailsId(null)}
        onStatusChange={handleStatusChange}
        onTemperatureChange={updateTemperature}
        onAgentChange={handleAgentChange}
        onSaveAnnotation={handleSaveAnnotation}
        onAddCommunication={handleAddCommunication}
      />
    </Box>
  );
}
