import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Container,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Visibility as ViewIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getAllTrips } from "../endpoints";

const AdminTripsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${getAllTrips}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Delete failed");
        
        setData(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete trip");
      }
    }
  };

  const columns = [
    { field: "sno", headerName: "#", width: 80, sortable: false, headerAlign: "center", align: "center" },
    { field: "name", headerName: "Trip Name", flex: 1, minWidth: 250 },
    { field: "price", headerName: "Price (INR)", type: "number", width: 150 },
    { field: "daysCount", headerName: "Days", type: "number", width: 100 },
    { field: "nightsCount", headerName: "Nights", type: "number", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton color="info" size="small" onClick={() => navigate(`/trips/${params.row.id}`)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Trip">
            <IconButton color="primary" size="small" onClick={() => navigate(`/admin/edit-trip/${params.row.id}`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Trip">
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await fetch(getAllTrips, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }

        const result = await response.json();
        setData(
          result.map((item, index) => ({
            ...item,
            id: item._id,
            sno: index + 1,
          }))
        );
      } catch (error) {
        setError("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [navigate]);

  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4] }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Trip Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/admin/cms/add-trip"
            >
              Add New Trip
            </Button>
          </Box>

          <Box sx={{ height: 650, width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                checkboxSelection
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }}
                sx={{
                  border: 0,
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.text.primary, // Changed to text.primary for visibility
                    fontSize: '1rem',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: `1px solid ${theme.palette.divider}`,
                  },
                  '& .MuiDataGrid-toolbarContainer': {
                    padding: theme.spacing(1),
                    justifyContent: 'flex-end'
                  }
                }}
              />
            )}
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default AdminTripsPage;