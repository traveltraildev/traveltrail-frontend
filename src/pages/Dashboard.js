// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Badge,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../endpoints';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAdminAuthenticated } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      window.location.href = '/admin/login';
      return;
    }

    const fetchAdminData = async () => {
      try {
        // Fetch bookings
        const bookingsResponse = await fetch('/api/bookings');
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        // Fetch users
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch trips
        const tripsResponse = await fetch('/api/trips');
        if (!tripsResponse.ok) throw new Error('Failed to fetch trips');
        const tripsData = await tripsResponse.json();
        setTrips(tripsData);

        // Fetch accommodations
        const accommodationsResponse = await fetch(`${BASE_URL}/api/accommodations`);
        if (!accommodationsResponse.ok) throw new Error('Failed to fetch accommodations');
        const accommodationsData = await accommodationsResponse.json();
        setAccommodations(accommodationsData.data);

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdminAuthenticated]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.length > 2) {
      // In a real application, you would send a request to your backend
      // Here's a mock implementation
      const mockResults = [
        { id: 1, type: 'user', name: 'John Doe', email: 'john@example.com' },
        { id: 2, type: 'trip', name: 'Beach Vacation', destination: 'Maldives' },
        { id: 3, type: 'booking', id: 'B123', user: 'Jane Smith', trip: 'Mountain Adventure' },
      ].filter(item =>
        item.name ? item.name.toLowerCase().includes(event.target.value.toLowerCase()) : false
      );

      setSearchResults(mockResults);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 8, pb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Admin Dashboard
      </Typography>

      {/* Actions Panel - moved to top */}
      <Box sx={{ mb: 4 }}>
        <Card sx={{ display: 'flex', gap: 2, p: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/cms/add-trip"
            sx={{ flex: 1, minWidth: 180 }}
          >
            Add New Trip
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/admin/add-accommodation"
            sx={{ flex: 1, minWidth: 180 }}
          >
            Add New Accommodation
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/admin/manage-bookings"
            sx={{ flex: 1, minWidth: 180 }}
          >
            Manage Bookings
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/admin/cms"
            sx={{ flex: 1, minWidth: 180 }}
          >
            Manage CMS Content
          </Button>
        </Card>
      </Box>

      {/* Search Bar with Suggestions */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            borderRadius: '50px',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search users, trips, bookings..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearch}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        {showSearchResults && (
          <Paper
            sx={{
              position: 'absolute',
              top: 56,
              left: 0,
              right: 0,
              mx: 'auto',
              mt: 1,
              borderRadius: '4px',
              boxShadow: 3,
              width: '100%',
              maxWidth: 600,
            }}
          >
            {searchResults.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableBody>
                    {searchResults.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.type === 'user' ? 'User' : item.type === 'trip' ? 'Trip' : 'Booking'}</TableCell>
                        <TableCell>{item.name || item.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box p={2} textAlign="center">
                No results found
              </Box>
            )}
          </Paper>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading dashboard data...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Stats Cards */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Bookings
                </Typography>
                <Typography variant="h5">{bookings.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h5">{users.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Trips
                </Typography>
                <Typography variant="h5">{trips.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Accommodations
                </Typography>
                <Typography variant="h5">{accommodations.length}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Bookings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Bookings
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Trip</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.slice(0, 5).map(booking => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.user.name}</TableCell>
                          <TableCell>{booking.trip.name}</TableCell>
                          <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              color={booking.status === 'completed' ? 'success' : booking.status === 'pending' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Users */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Users
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.slice(0, 5).map(user => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.isActive ? 'Active' : 'Inactive'}
                              color={user.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Trips */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Popular Trips
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Trip Name</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Bookings</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trips.slice(0, 5).map(trip => (
                        <TableRow key={trip.id}>
                          <TableCell>{trip.name}</TableCell>
                          <TableCell>{trip.destination}</TableCell>
                          <TableCell>{trip.bookingsCount || 0}</TableCell>
                          <TableCell>
                            <Chip
                              label={trip.isActive ? 'Active' : 'Inactive'}
                              color={trip.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Accommodations */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Accommodations
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accommodations.slice(0, 5).map(accommodation => (
                        <TableRow key={accommodation.id}>
                          <TableCell>{accommodation.name}</TableCell>
                          <TableCell>{accommodation.location}</TableCell>
                          <TableCell>${accommodation.price}</TableCell>
                          <TableCell>
                            <Chip
                              label={accommodation.isActive ? 'Available' : 'Unavailable'}
                              color={accommodation.isActive ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          // ...existing code...
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;