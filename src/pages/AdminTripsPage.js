import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
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
  styled,
  Paper,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as ViewIcon } from "@mui/icons-material";
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

  const columns = [
    {
      field: "sno",
      headerName: "#",
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    { field: "name", headerName: "Trip Name", flex: 2 },
    { field: "price", headerName: "Price (INR)", type: "number", width: 150 },
    { field: "daysCount", headerName: "Days", type: "number", width: 100 },
    { field: "nightsCount", headerName: "Nights", type: "number", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            color="info"
            size="small"
            onClick={() => navigate(`/trips/${params.row.id}`)}
          >
            <Tooltip title="View Details">
              <ViewIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/admin/edit-trip/${params.row.id}`)}
          >
            <Tooltip title="Edit Trip">
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            <Tooltip title="Delete Trip">
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        </Box>
      ),
    },
  ];

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

  useEffect(() => {
    fetchTrips();
  }, []);

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

  const LoadingContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  }));

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper 
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Trip Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              component={Link}
              to="/admin/cms/add-trip"
              sx={{ px: 3, height: "40px" }}
            >
              Add New Trip
            </Button>
          </Box>

          {loading ? (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          ) : (
            <Box sx={{ height: 550, width: "100%" }}>
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      cursor: 'pointer',
                    },
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default AdminTripsPage;