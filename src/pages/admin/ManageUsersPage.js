import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, TableSortLabel, TablePagination, TextField, Button, Chip } from '@mui/material';
import { BASE_URL } from '../../endpoints';
import { useAuth } from '@clerk/clerk-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const ManageUsersPage = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [getToken]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleBlockUser = async (userId) => {
    try {
      const token = await getToken();
      await fetch(`${BASE_URL}/api/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers(); // Refresh users after action
    } catch (err) {
      console.error("Failed to block user", err);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const token = await getToken();
      await fetch(`${BASE_URL}/api/admin/users/${userId}/unblock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers(); // Refresh users after action
    } catch (err) {
      console.error("Failed to unblock user", err);
    }
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(filter.toLowerCase())) || 
    (user.email && user.email.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Manage Users</Typography>
        <Box sx={{ mb: 2 }}>
          <TextField 
            label="Search by name or email"
            variant="outlined"
            fullWidth
            onChange={handleFilterChange}
          />
        </Box>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={(e) => handleRequestSort(e, 'name')}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'email'}
                        direction={orderBy === 'email' ? order : 'asc'}
                        onClick={(e) => handleRequestSort(e, 'email')}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'createdAt'}
                        direction={orderBy === 'createdAt' ? order : 'asc'}
                        onClick={(e) => handleRequestSort(e, 'createdAt')}
                      >
                        Joining Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'lastActive'}
                        direction={orderBy === 'lastActive' ? order : 'asc'}
                        onClick={(e) => handleRequestSort(e, 'lastActive')}
                      >
                        Last Active
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stableSort(filteredUsers, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip label={user.status} color={user.status === 'active' ? 'success' : 'error'} />
                        </TableCell>
                        <TableCell>
                          {user.status === 'active' ? (
                            <Button variant="contained" color="error" onClick={() => handleBlockUser(user._id)}>Block</Button>
                          ) : (
                            <Button variant="contained" color="success" onClick={() => handleUnblockUser(user._id)}>Unblock</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default ManageUsersPage;
