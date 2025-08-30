import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TableSortLabel,
  ListItemIcon
} from '@mui/material';
import { Search, AddComment, Notes, Person as PersonIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAdminAuthHeader } from '../utils';
import { BASE_URL } from '../endpoints';
import useDebounce from '../hooks/useDebounce';

const theme = createTheme({
  palette: {
    primary: { main: '#D5614A' },
    secondary: { main: '#F1CC5A' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 700 },
  },
});

const bookingStatusOptions = ['New', 'Contacted', 'Itinerary Shared', 'Quotation Sent', 'Booked', 'Lost'];

const statusColors = {
  New: 'info',
  Contacted: 'primary',
  'Itinerary Shared': 'secondary',
  'Quotation Sent': 'warning',
  Booked: 'success',
  Lost: 'error',
};

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', direction: 'desc' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [annotationText, setAnnotationText] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAdminAuthHeader();
      if (!headers.Authorization) throw new Error('Admin token not found. Please log in.');

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        sortField: sort.field,
        sortOrder: sort.direction,
        searchTerm: debouncedSearchTerm,
      });

      const response = await fetch(`${BASE_URL}/api/admin/bookings?${params.toString()}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch bookings.');

      const result = await response.json();
      if (result.success) {
        setBookings(result.data);
        setTotalBookings(result.pagination.totalBookings);
      } else {
        throw new Error(result.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sort, debouncedSearchTerm]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const originalBookings = [...bookings];
    const updatedBookings = bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b);
    setBookings(updatedBookings);

    try {
      const headers = { ...getAdminAuthHeader(), 'Content-Type': 'application/json' };
      const response = await fetch(`${BASE_URL}/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
    } catch (err) {
      setError('Failed to update status. Reverting changes.');
      setBookings(originalBookings);
    }
  };

  const handleAddAnnotation = async () => {
    if (!annotationText.trim() || !selectedBooking) return;
    try {
      const headers = { ...getAdminAuthHeader(), 'Content-Type': 'application/json' };
      const response = await fetch(`${BASE_URL}/api/admin/bookings/${selectedBooking._id}/annotations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: annotationText })
      });
      if (!response.ok) throw new Error('Failed to add annotation');
      
      fetchBookings(); // Refetch to show the new annotation
      handleCloseDialog();
    } catch (err) {
      setError('Failed to add annotation.');
    }
  };

  const handleSort = (field) => {
    const isAsc = sort.field === field && sort.direction === 'asc';
    setSort({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setAnnotationText('');
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ m: 0 }}>
            Manage Bookings
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name, email, or trip..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            }}
          />
        </Box>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' } }}>
                  <TableCell><TableSortLabel active={sort.field === 'user.name'} direction={sort.direction} onClick={() => handleSort('user.name')}>Customer</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sort.field === 'trip.name'} direction={sort.direction} onClick={() => handleSort('trip.name')}>Trip</TableSortLabel></TableCell>
                  <TableCell>Attendees</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Annotations</TableCell>
                  <TableCell align="right"><TableSortLabel active={sort.field === 'createdAt'} direction={sort.direction} onClick={() => handleSort('createdAt')}>Booked On</TableSortLabel></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                    <TableRow hover key={booking._id}>
                        <TableCell>
                        <Typography variant="body2" fontWeight="500">{booking.user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{booking.user.email}</Typography>
                        </TableCell>
                        <TableCell>{booking.trip?.name || 'N/A'}</TableCell>
                        <TableCell align="center">{((booking.attendees?.adults || 0) + (booking.attendees?.children || 0)) || 1}</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>
                        <Select
                            value={booking.status || 'New'}
                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            size="small"
                            fullWidth
                            renderValue={(selected) => (
                                <Chip label={selected} color={statusColors[selected]} size="small" />
                            )}
                        >
                            {bookingStatusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                        </Select>
                        </TableCell>
                        <TableCell>
                        <Tooltip title="View/Add Annotations">
                            <IconButton onClick={() => handleOpenDialog(booking)} size="small">
                            {booking.annotations?.length > 0 ? <Notes color="primary" /> : <AddComment />}
                            </IconButton>
                        </Tooltip>
                        </TableCell>
                        <TableCell align="right">{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalBookings}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Paper>
      </Box>

      <Dialog open={!!selectedBooking} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Annotations for {selectedBooking?.trip?.name}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Add new annotation..."
              fullWidth
              multiline
              rows={2}
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
            />
            <Button onClick={handleAddAnnotation} variant="contained">Add</Button>
          </Box>
          <List>
            {selectedBooking?.annotations?.length > 0 ? selectedBooking.annotations.map((note, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                    <ListItemIcon sx={{minWidth: 40, mt: 0.5}}><PersonIcon fontSize='small' /></ListItemIcon>
                  <ListItemText
                    primary={note.text}
                    secondary={`by ${note.author} on ${new Date(note.timestamp).toLocaleString()}`}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            )) : <Typography sx={{ p: 2, textAlign: 'center' }}>No annotations yet.</Typography>}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ManageBookingsPage;