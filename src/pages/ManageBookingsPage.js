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
  ListItemIcon,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { Search, AddComment, Notes, Person as PersonIcon, Phone, Mail, MonetizationOn, NewReleases, Task, Add as AddIcon, FlightTakeoff, Hotel } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '@clerk/clerk-react';
import { BASE_URL } from '../endpoints';
import useDebounce from '../hooks/useDebounce';
import AddBookingDialog from '../components/common/AddBookingDialog';

const theme = createTheme({
  palette: {
    primary: { main: '#D5614A' },
    secondary: { main: '#F1CC5A' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
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

const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3} sx={{ borderRadius: 2, color }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {value}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
                {icon}
            </Box>
        </CardContent>
    </Card>
);

const ManageBookingsPage = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, newLeads: 0, followUpsRequired: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', direction: 'desc' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [annotationText, setAnnotationText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [lastStatusChange, setLastStatusChange] = useState(null);
  const [addBookingOpen, setAddBookingOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchStats = useCallback(async () => {
    try {
        const token = await getToken();
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(`${BASE_URL}/api/admin/bookings/stats`, { headers });
        if (!response.ok) throw new Error('Failed to fetch stats.');
        const result = await response.json();
        if (result.success) {
            setStats(result.data);
        }
    } catch (err) {
        console.error("Stat fetch error:", err.message);
        setError(prev => prev || err.message);
    }
  }, [getToken]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Admin token not found. Please log in.');

      const headers = { 'Authorization': `Bearer ${token}` };

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
  }, [page, rowsPerPage, sort, debouncedSearchTerm, getToken]);

  const refreshData = useCallback(() => {
    fetchBookings();
    fetchStats();
  }, [fetchBookings, fetchStats]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    return () => {
      setLastStatusChange(null);
    };
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    const originalBookings = [...bookings];
    const bookingToUpdate = bookings.find(b => b._id === bookingId);
    const oldStatus = bookingToUpdate.status;
    const updatedBookings = bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b);
    setBookings(updatedBookings);
    setLastStatusChange({ bookingId, oldStatus, newStatus });

    try {
      const token = await getToken();
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const response = await fetch(`${BASE_URL}/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You are not authorized to perform this action.');
        }
        throw new Error('Failed to update status');
      }
      setSnackbar({ open: true, message: 'Status updated successfully!', severity: 'success' });
      fetchStats(); // Re-fetch stats after status change
    } catch (err) {
      setError(err.message);
      setBookings(originalBookings);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleUndoStatusChange = async () => {
    if (!lastStatusChange) return;
    const { bookingId, oldStatus } = lastStatusChange;
    const originalBookings = [...bookings];
    const updatedBookings = bookings.map(b => b._id === bookingId ? { ...b, status: oldStatus } : b);
    setBookings(updatedBookings);

    try {
      const token = await getToken();
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      await fetch(`${BASE_URL}/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: oldStatus })
      });
      setSnackbar({ open: true, message: 'Status change reverted.', severity: 'info' });
      fetchStats(); // Re-fetch stats after undoing
    } catch (err) {
      setError('Failed to revert status change.');
      setBookings(originalBookings);
      setSnackbar({ open: true, message: 'Failed to revert status change.', severity: 'error' });
    }
    setLastStatusChange(null);
    handleCloseSnackbar();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddAnnotation = async () => {
    if (!annotationText.trim() || !selectedBooking) return;
    try {
      const token = await getToken();
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
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

  if (error && !bookings.length) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ m: 0 }}>
            Sales Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddBookingOpen(true)}>
                Add Booking
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Bookings" value={stats.totalBookings} icon={<PersonIcon fontSize="large" />} color="#D5614A" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="New Leads (30d)" value={stats.newLeads} icon={<NewReleases fontSize="large" />} color="#F1CC5A" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Follow-ups" value={stats.followUpsRequired} icon={<Task fontSize="large" />} color="#3498db" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Value" value={`₹${(stats.totalValue || 0).toLocaleString('en-IN')}`} icon={<MonetizationOn fontSize="large" />} color="#2ecc71" />
            </Grid>
        </Grid>

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
                  <TableCell><TableSortLabel active={sort.field === 'userName'} direction={sort.direction} onClick={() => handleSort('userName')}>Customer</TableSortLabel></TableCell>
                  <TableCell><TableSortLabel active={sort.field === 'tripName'} direction={sort.direction} onClick={() => handleSort('tripName')}>Trip</TableSortLabel></TableCell>
                  <TableCell>Attendees</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Log/View</TableCell>
                  <TableCell><TableSortLabel active={sort.field === 'value'} direction={sort.direction} onClick={() => handleSort('value')}>Value</TableSortLabel></TableCell>
                  <TableCell>Last Contacted</TableCell>
                  <TableCell align="right"><TableSortLabel active={sort.field === 'createdAt'} direction={sort.direction} onClick={() => handleSort('createdAt')}>Booked On</TableSortLabel></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                    <TableRow hover key={booking._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {booking.isGuest && (
                              <Tooltip title={booking.isManual ? "Manually Added Lead" : "Guest User"}>
                                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              </Tooltip>
                            )}
                            <div>
                              <Typography variant="body2" fontWeight="500">{booking.userName}</Typography>
                              <Link href={`mailto:${booking.userEmail}`} variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Mail fontSize="inherit"/> {booking.userEmail || 'N/A'}</Link>
                              {booking.userPhone && <Link href={`tel:${booking.userPhone}`} variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Phone fontSize="inherit"/> {booking.userPhone}</Link>}
                            </div>
                          </Box>
                        </TableCell>
                                                <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title={booking.bookingType}>
                                    {booking.bookingType === 'Trip' ? <FlightTakeoff color="action" /> : <Hotel color="action" />}
                                </Tooltip>
                                {booking.tripName || 'N/A'}
                            </Box>
                        </TableCell>
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
                        <Tooltip title="Log or View Interactions">
                            <IconButton onClick={() => handleOpenDialog(booking)} size="small">
                            {booking.annotations?.length > 0 ? <Notes color="primary" /> : <AddComment />}
                            </IconButton>
                        </Tooltip>
                        </TableCell>
                        <TableCell>₹{(booking.value || 0).toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                            {booking.annotations?.length > 0 
                                ? new Date(booking.annotations[0].timestamp).toLocaleDateString()
                                : 'Never'
                            }
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

      <AddBookingDialog 
        open={addBookingOpen} 
        onClose={() => setAddBookingOpen(false)} 
        onBookingAdded={() => {
            setSnackbar({ open: true, message: 'Booking added successfully!', severity: 'success' });
            refreshData();
        }}
        getToken={getToken} 
      />

      <Dialog open={!!selectedBooking} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Interaction Log for {selectedBooking?.tripName}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Log new interaction (e.g., 'Called, left voicemail')..."
              fullWidth
              multiline
              rows={2}
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
            />
            <Button onClick={handleAddAnnotation} variant="contained">Log</Button>
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
            )) : <Typography sx={{ p: 2, textAlign: 'center' }}>No interactions logged yet.</Typography>}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
          {lastStatusChange && snackbar.severity === 'success' && (
            <Button color="inherit" size="small" onClick={handleUndoStatusChange}>
              UNDO
            </Button>
          )}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ManageBookingsPage;
