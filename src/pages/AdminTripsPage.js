// Replace the existing AdminTripsPage component with this
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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
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
      headerName: "S.No",
      width: 80,
      valueGetter: (params) => params?.api?.getRowIndex(params.row.id) + 1,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "price", headerName: "Price", type: "number", width: 120 },
    { field: "daysCount", headerName: "Days", type: "number", width: 100 },
    { field: "nightsCount", headerName: "Nights", type: "number", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View Details">
              <ViewIcon color="info" />
            </Tooltip>
          }
          onClick={() => navigate(`/trips/${params.row.id}`)}
          label="View"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Edit Trip">
              <EditIcon color="primary" />
            </Tooltip>
          }
          onClick={() => navigate(`/admin/edit-trip/${params.row.id}`)}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete Trip">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          onClick={() => handleDelete(params.row.id)}
          label="Delete"
        />,
      ],
    },
  ];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${getAllTrips}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Delete failed");
        }

        setData(data.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting trip:", error);
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
      setData(
        result.map((item) => ({
          ...item,
          id: item._id,
        }))
      );
    } catch (error) {
      setError("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trip Management
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e0e0e0",
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default AdminTripsPage;
