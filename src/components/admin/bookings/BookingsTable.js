// src/components/admin/bookings/BookingsTable.js
import React, { useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BookingStatusSelect, TemperatureToggle } from './BookingStatusChip';
import {
  emailTemplateHref,
  formatCurrency,
  formatDate,
  telHref,
  whatsAppHref,
  whatsAppTemplate,
} from './bookingsUtils';

function NoRowsOverlay() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{ height: '100%', p: 4, textAlign: 'center' }}
    >
      <SearchOffIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
      <Typography variant="h6" color="text.primary">
        No bookings found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting your filters or search terms.
      </Typography>
    </Stack>
  );
}

/**
 * DataGrid listing the (already filtered) bookings. Selection, sorting and
 * pagination come from the grid; row details open in BookingDetailsDialog.
 */
export default function BookingsTable({
  bookings,
  loading,
  selectionModel,
  onSelectionModelChange,
  onStatusChange,
  onTemperatureChange,
  onViewDetails,
}) {
  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'Lead ID', width: 100, minWidth: 90 },
      {
        field: 'customerName',
        headerName: 'Customer',
        flex: 1,
        minWidth: 170,
        renderCell: (params) => (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {params.row.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              {params.row.phone}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'trip',
        headerName: 'Trip Details',
        flex: 1.3,
        minWidth: 210,
        renderCell: (params) => (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" noWrap>
              {params.row.trip}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {params.row.destination}
              </Typography>
              <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary', ml: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {params.row.pax} pax
              </Typography>
            </Stack>
          </Box>
        ),
      },
      {
        field: 'travelDate',
        headerName: 'Travel Date',
        type: 'date',
        minWidth: 120,
        valueGetter: (value) => (value ? new Date(value) : null),
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: 'budget',
        headerName: 'Budget',
        type: 'number',
        minWidth: 120,
        valueFormatter: (value) => formatCurrency(value),
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 180,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ width: '100%' }}>
            <BookingStatusSelect
              fullWidth
              value={params.row.status}
              onChange={(status) => onStatusChange(params.row.id, status)}
              label={`Status for ${params.row.customerName}`}
            />
          </Box>
        ),
      },
      {
        field: 'temperature',
        headerName: 'Temperature',
        minWidth: 140,
        sortable: false,
        renderCell: (params) => (
          <TemperatureToggle
            value={params.row.temperature}
            onChange={(temperature) => onTemperatureChange(params.row.id, temperature)}
          />
        ),
      },
      {
        field: 'lastContact',
        headerName: 'Last Contact',
        type: 'date',
        minWidth: 125,
        valueGetter: (value) => (value ? new Date(value) : null),
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: 'annotations',
        headerName: 'Annotations',
        flex: 1,
        minWidth: 160,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.value || 'No notes'}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 170,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View details">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onViewDetails(params.row.id)}
                aria-label={`View details for ${params.row.customerName}`}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Call">
              <IconButton
                size="small"
                color="success"
                component="a"
                href={telHref(params.row.phone)}
                aria-label={`Call ${params.row.customerName}`}
              >
                <PhoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="WhatsApp">
              <IconButton
                size="small"
                sx={{ color: 'success.main' }}
                component="a"
                href={whatsAppHref(params.row.phone, whatsAppTemplate(params.row))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${params.row.customerName}`}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email template">
              <IconButton
                size="small"
                color="info"
                component="a"
                href={emailTemplateHref(params.row)}
                aria-label={`Email ${params.row.customerName}`}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onStatusChange, onTemperatureChange, onViewDetails]
  );

  return (
    // Horizontal scroll container keeps the grid usable on small screens.
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth: 960, height: 620 }}>
        <DataGrid
          rows={bookings}
          columns={columns}
          loading={loading}
          rowHeight={64}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={onSelectionModelChange}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{ noRowsOverlay: NoRowsOverlay }}
          slotProps={{
            loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
          }}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'grey.100',
              color: 'text.primary',
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'action.hover',
            },
          }}
        />
      </Box>
    </Box>
  );
}
