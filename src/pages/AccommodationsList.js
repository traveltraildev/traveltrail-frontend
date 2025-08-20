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
  Paper,
  useTheme
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getAllAccommodations } from "../endpoints";

const AccommodationsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleView = (id) => {
    navigate(`/accommodations/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-accommodation/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accommodation?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${getAllAccommodations}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setData(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      setError(error.message || "Failed to delete accommodation");
      console.error("Delete error:", error);
    }
  };

  const columns = [
    { 
      field: "sno", 
      headerName: "#", 
      width: 80, 
      headerAlign: "center", 
      align: "center", 
      sortable: false 
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
    { field: "price", headerName: "Price (INR)", type: "number", width: 150 },
    { field: "roomType", headerName: "Room Type", width: 150 },
    {
      field: "maxOccupancy",
      headerName: "Capacity",
      type: "number",
      width: 120,
    },
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
            <IconButton color="info" size="small" onClick={() => handleView(params.row._id)}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Accommodation">
            <IconButton color="primary" size="small" onClick={() => handleEdit(params.row._id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Accommodation">
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await fetch(getAllAccommodations, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch data");
        }

        const formattedData = result.data.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));

        setData(formattedData);
      } catch (err) {
        setError(err.message || "Failed to fetch accommodations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[4] }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Accommodations
          </Typography>
          <Box sx={{ height: 650, width: '100%' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row._id}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
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

export default AccommodationsList;