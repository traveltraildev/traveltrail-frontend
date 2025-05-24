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
  styled,
  Paper,
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

  const columns = [
    {
      field: "sno",
      headerName: "#",
      width: 80,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    { field: "name", headerName: "Name", flex: 2 },
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
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            color="info"
            size="small"
            onClick={() => handleView(params.row._id)}
          >
            <Tooltip title="View Details" arrow>
              <ViewIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row._id)}
          >
            <Tooltip title="Edit Accommodation" arrow>
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row._id)}
          >
            <Tooltip title="Delete Accommodation" arrow>
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        </Box>
      ),
    },
  ];

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

        // Add S.No based on initial data order
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

  const PageContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
  }));

  const Header = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(2),
  }));

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2, mt: 8 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: theme.spacing(6) }}>
        <PageContainer>
          <Header>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Accommodations List
            </Typography>
          </Header>

          <Box sx={{ height: "calc(100vh - 400px)", width: "100%" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row._id}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                components={{
                  Toolbar: () => (
                    <GridToolbar sx={{ justifyContent: "flex-end" }} />
                  ),
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "& .MuiDataGrid-actionsCell": {
                    justifyContent: "center",
                  },
                }}
              />
            )}
          </Box>
        </PageContainer>
      </Container>
      <Footer />
    </>
  );
};

export default AccommodationsList;