import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import { CircularProgress, Alert, IconButton, Tooltip } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AccommodationsList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Add serial number column
  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
      valueGetter: (params) => params?.api?.getRowIndex(params.row.id) + 1,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "price", headerName: "Price", type: "number", width: 120 },
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
      type: "actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="View Details">
              <ViewIcon color="info" />
            </Tooltip>
          }
          onClick={() => handleView(params.row._id)}
          label="View"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Edit Accommodation">
              <EditIcon color="primary" />
            </Tooltip>
          }
          onClick={() => handleEdit(params.row._id)}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title="Delete Accommodation">
              <DeleteIcon color="error" />
            </Tooltip>
          }
          onClick={() => handleDelete(params.row._id)}
          label="Delete"
        />,
      ],
    },
  ];

  const handleView = (id) => {
    navigate(`/view-accommodation/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-accommodation/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `http://localhost:5000/api/accommodations/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Delete failed");

        setData(data.filter((item) => item._id !== id));
      } catch (error) {
        setError(error.message);
      }
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
        const response = await fetch(
          "http://localhost:5000/api/accommodations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
          return;
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch data");
        }

        setData(
          result.data.map((item) => ({
            ...item,
            id: item._id, // Convert for DataGrid compatibility
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (error)
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );

  return (
    <div style={{ height: 600, width: "100%", padding: "20px" }}>
      <DataGrid
        getRowId={(row) => row._id}
        rows={data}
        columns={columns}
        loading={loading}
        components={{
          Toolbar: GridToolbar,
        }}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default AccommodationsList;
