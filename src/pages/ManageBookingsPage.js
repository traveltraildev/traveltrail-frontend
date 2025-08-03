import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  IconButton,
  Collapse,
  Typography,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Slider,
  Autocomplete,
  Fab,
  Alert,
  Avatar,
  Divider,
  Stack,
  Tooltip,
  Badge
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Search,
  FilterList,
  Phone,
  Email,
  Calendar,
  LocationOn,
  People,
  AttachMoney,
  ExpandMore,
  ExpandLess,
  Edit,
  WhatsApp,
  Schedule,
  GetApp,
  Add,
  CheckBox,
  CheckBoxOutlineBlank,
  Sort,
  Refresh,
  Close,
  Assignment,
  Send,
  Notifications
} from '@mui/icons-material';

// Your custom theme
const palette = {
  primary: {
    main: '#D5614A',
    contrastText: '#222222',
    dark: '#C04A34',
    light: '#E48C7A',
  },
  secondary: {
    main: '#F1CC5A',
    contrastText: '#222222',
    light: '#F6DEA3',
    dark: '#DAB74F',
  },
  accent: {
    main: '#6A8E9A',
    contrastText: '#ffffff',
    light: '#8FB0BB',
    dark: '#50707A',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: '#222222',
    secondary: '#555555',
  },
  action: {
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)'
  }
};

const typography = {
  fontFamily: [
    'Circular STD',
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  fontSize: 16,
  h1: { fontWeight: 700, fontSize: '2.5rem' },
  h2: { fontWeight: 700, fontSize: '2rem' },
  h3: { fontWeight: 600, fontSize: '1.75rem' },
  h4: { fontWeight: 600, fontSize: '1.5rem' },
  h5: { fontWeight: 500, fontSize: '1.25rem' },
  h6: { fontWeight: 500, fontSize: '1.125rem' },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  }
};

const shadows = [
  'none',
  '0 1px 2px rgba(0,0,0,0.08)',
  '0 2px 4px rgba(0,0,0,0.08)',
  '0 3px 6px rgba(0,0,0,0.08)',
  '0 4px 8px rgba(0,0,0,0.08)',
  '0 5px 10px rgba(0,0,0,0.08)',
  '0 6px 12px rgba(0,0,0,0.08)',
  '0 7px 14px rgba(0,0,0,0.08)',
  '0 8px 16px rgba(0,0,0,0.08)',
  '0 9px 18px rgba(0,0,0,0.08)',
  '0 10px 20px rgba(0,0,0,0.08)',
  '0 11px 22px rgba(0,0,0,0.08)',
  '0 12px 24px rgba(0,0,0,0.08)',
  '0 13px 26px rgba(0,0,0,0.08)',
  '0 14px 28px rgba(0,0,0,0.08)',
  '0 15px 30px rgba(0,0,0,0.08)',
  '0 16px 32px rgba(0,0,0,0.08)',
  '0 17px 34px rgba(0,0,0,0.08)',
  '0 18px 36px rgba(0,0,0,0.08)',
  '0 19px 38px rgba(0,0,0,0.08)',
  '0 20px 40px rgba(0,0,0,0.08)',
  '0 21px 42px rgba(0,0,0,0.08)',
  '0 22px 44px rgba(0,0,0,0.08)',
  '0 23px 46px rgba(0,0,0,0.08)',
  '0 24px 48px rgba(0,0,0,0.08)',
];

const theme = createTheme({
  palette: palette,
  typography: typography,
  spacing: 8,
  shadows: shadows,
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`,
            outlineOffset: '2px',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          borderRadius: '4px',
          transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`,
            outlineOffset: '2px',
          }
        },
        containedPrimary: {
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          '&:hover': {
            backgroundColor: palette.primary.dark,
            boxShadow: shadows[2],
            transform: 'scale(1.05)',
          },
        },
        containedSecondary: {
          backgroundColor: palette.secondary.main,
          color: palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: palette.secondary.dark,
            boxShadow: shadows[2],
            transform: 'scale(1.05)',
          },
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

// Sample data
const initialLeads = [
  {
    id: 'LD001',
    customerName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    trip: 'Kashmir Valley Tour',
    travelDate: '2025-08-15',
    pax: 4,
    budget: 150000,
    status: 'new',
    temperature: 'hot',
    lastContact: '2025-08-01',
    agent: 'Priya Sharma',
    destination: 'Kashmir',
    notes: 'Family trip for anniversary celebration',
    communications: [
      { type: 'call', date: '2025-08-01', note: 'Initial inquiry call' },
      { type: 'whatsapp', date: '2025-07-30', note: 'Sent package details' }
    ],
    annotations: 'VIP customer - previous booking worth ₹2L'
  },
  {
    id: 'LD002',
    customerName: 'Sneha Patel',
    phone: '+91 87654 32109',
    trip: 'Goa Beach Holiday',
    travelDate: '2025-08-20',
    pax: 2,
    budget: 80000,
    status: 'contacted',
    temperature: 'warm',
    lastContact: '2025-07-28',
    agent: 'Amit Singh',
    destination: 'Goa',
    notes: 'Honeymoon package inquiry',
    communications: [
      { type: 'email', date: '2025-07-28', note: 'Sent brochure' }
    ],
    annotations: 'Prefers luxury accommodations'
  },
  {
    id: 'LD003',
    customerName: 'Mohammed Ali',
    phone: '+91 76543 21098',
    trip: 'Rajasthan Heritage Tour',
    travelDate: '2025-09-10',
    pax: 6,
    budget: 300000,
    status: 'itinerary_shared',
    temperature: 'hot',
    lastContact: '2025-08-02',
    agent: 'Kavita Joshi',
    destination: 'Rajasthan',
    notes: 'Corporate group booking',
    communications: [
      { type: 'call', date: '2025-08-02', note: 'Discussed itinerary changes' },
      { type: 'email', date: '2025-08-01', note: 'Sent revised itinerary' }
    ],
    annotations: 'Decision maker - ready to book'
  },
  {
    id: 'LD004',
    customerName: 'Anita Desai',
    phone: '+91 65432 10987',
    trip: 'Kerala Backwaters',
    travelDate: '2025-08-25',
    pax: 3,
    budget: 120000,
    status: 'quotation_sent',
    temperature: 'warm',
    lastContact: '2025-07-30',
    agent: 'Rohit Mehta',
    destination: 'Kerala',
    notes: 'Elderly parents travel',
    communications: [
      { type: 'email', date: '2025-07-30', note: 'Quotation sent' }
    ],
    annotations: 'Price sensitive - negotiate if needed'
  },
  {
    id: 'LD005',
    customerName: 'Vikram Singh',
    phone: '+91 54321 09876',
    trip: 'Himachal Adventure',
    travelDate: '2025-08-12',
    pax: 8,
    budget: 200000,
    status: 'booked',
    temperature: 'hot',
    lastContact: '2025-08-03',
    agent: 'Priya Sharma',
    destination: 'Himachal Pradesh',
    notes: 'Adventure enthusiasts group',
    communications: [
      { type: 'call', date: '2025-08-03', note: 'Booking confirmed' },
      { type: 'email', date: '2025-08-02', note: 'Payment received' }
    ],
    annotations: 'Confirmed booking - send welcome kit'
  }
];

const statusConfig = {
  all: { label: 'All Leads', color: '#6A8E9A', count: 46 },
  new: { label: 'New', color: '#4CAF50', count: 12 },
  contacted: { label: 'Contacted', color: '#2196F3', count: 8 },
  itinerary_shared: { label: 'Itinerary Shared', color: '#FF9800', count: 15 },
  quotation_sent: { label: 'Quotation Sent', color: '#9C27B0', count: 6 },
  booked: { label: 'Booked', color: '#4CAF50', count: 3 },
  lost: { label: 'Lost', color: '#F44336', count: 2 }
};

const temperatureConfig = {
  hot: { label: 'Hot', emoji: '🔥', color: '#F44336', count: 18 },
  warm: { label: 'Warm', emoji: '🌡️', color: '#FF9800', count: 22 },
  cold: { label: 'Cold', emoji: '🧊', color: '#2196F3', count: 6 }
};

const destinations = ['Kashmir', 'Goa', 'Rajasthan', 'Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Maharashtra', 'Karnataka'];
const agents = ['Priya Sharma', 'Amit Singh', 'Kavita Joshi', 'Rohit Mehta', 'Neha Gupta'];

export default function LeadManagementDashboard() {
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTemperature, setSelectedTemperature] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [budgetRange, setBudgetRange] = useState([0, 1000000]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showNotification, setShowNotification] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.destination.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
      const matchesTemperature = selectedTemperature === 'all' || lead.temperature === selectedTemperature;
      
      const matchesDateRange = !dateRange.start || !dateRange.end || 
        (new Date(lead.travelDate) >= new Date(dateRange.start) && 
         new Date(lead.travelDate) <= new Date(dateRange.end));
      
      const matchesBudget = lead.budget >= budgetRange[0] && lead.budget <= budgetRange[1];
      
      const matchesDestination = selectedDestinations.length === 0 || 
        selectedDestinations.includes(lead.destination);

      return matchesSearch && matchesStatus && matchesTemperature && 
             matchesDateRange && matchesBudget && matchesDestination;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'travelDate' || sortField === 'lastContact') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [leads, searchTerm, selectedStatus, selectedTemperature, dateRange, budgetRange, selectedDestinations, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRowExpansion = (leadId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleLeadSelection = (leadId) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const selectAllLeads = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)));
    }
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] } : lead
    ));
  };

  const updateLeadTemperature = (leadId, newTemperature) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, temperature: newTemperature } : lead
    ));
  };

  const updateAnnotation = (leadId, annotation) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, annotations: annotation } : lead
    ));
    setEditingAnnotation(null);
    setNewAnnotation('');
  };

  const bulkMarkAsContacted = () => {
    setLeads(prev => prev.map(lead => 
      selectedLeads.has(lead.id) ? { ...lead, status: 'contacted', lastContact: new Date().toISOString().split('T')[0] } : lead
    ));
    setSelectedLeads(new Set());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDatePreset = (preset) => {
    const today = new Date();
    const start = new Date(today);
    let end = new Date(today);

    switch (preset) {
      case 'this_week':
        const dayOfWeek = today.getDay();
        start.setDate(today.getDate() - dayOfWeek);
        end.setDate(start.getDate() + 6);
        break;
      case 'next_7_days':
        end.setDate(today.getDate() + 7);
        break;
      case 'this_month':
        start.setDate(1);
        end.setMonth(today.getMonth() + 1, 0);
        break;
      default:
        return;
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  const getTemperatureIcon = (temp) => {
    switch (temp) {
      case 'hot': return '🔥';
      case 'warm': return '🌡️';
      case 'cold': return '🧊';
      default: return '';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
        {/* New Lead Notification */}
        {showNotification && (
          <Alert 
            severity="success" 
            sx={{ mb: 2, position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
            action={
              <IconButton size="small" onClick={() => setShowNotification(false)}>
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            New lead received! Vikram Singh - Himachal Adventure
          </Alert>
        )}

        {/* Sticky Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'sticky', 
            top: 0, 
            zIndex: 100, 
            mb: 3,
            p: 3,
            borderRadius: 2
          }}
        >
          {/* Status Pipeline */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Lead Pipeline
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Chip
                  key={key}
                  label={`${config.label} (${config.count})`}
                  variant={selectedStatus === key ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: selectedStatus === key ? config.color : 'transparent',
                    borderColor: config.color,
                    color: selectedStatus === key ? '#fff' : config.color,
                    '&:hover': {
                      backgroundColor: selectedStatus === key ? config.color : `${config.color}20`,
                    }
                  }}
                  onClick={() => setSelectedStatus(selectedStatus === key ? 'all' : key)}
                />
              ))}
            </Stack>
          </Box>

          {/* Controls */}
          <Grid container spacing={3}>
            {/* Temperature Filter */}
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Temperature</Typography>
              <Stack direction="row" spacing={1}>
                {Object.entries(temperatureConfig).map(([key, config]) => (
                  <Tooltip key={key} title={`${config.label} (${config.count})`}>
                    <Chip
                      size="small"
                      label={`${config.emoji}${config.count}`}
                      variant={selectedTemperature === key ? "filled" : "outlined"}
                      sx={{
                        backgroundColor: selectedTemperature === key ? config.color : 'transparent',
                        borderColor: config.color,
                        color: selectedTemperature === key ? '#fff' : config.color,
                      }}
                      onClick={() => setSelectedTemperature(selectedTemperature === key ? 'all' : key)}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Grid>

            {/* Date Range */}
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Travel Date</Typography>
              <Stack direction="row" spacing={1}>
                {[
                  { key: 'this_week', label: 'This Week' },
                  { key: 'next_7_days', label: 'Next 7 Days' },
                  { key: 'this_month', label: 'This Month' }
                ].map(preset => (
                  <Button
                    key={preset.key}
                    size="small"
                    variant="outlined"
                    onClick={() => getDatePreset(preset.key)}
                    sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </Stack>
            </Grid>

            {/* Budget Range */}
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Budget: {formatCurrency(budgetRange[0])} - {formatCurrency(budgetRange[1])}
              </Typography>
              <Slider
                value={budgetRange}
                onChange={(_, newValue) => setBudgetRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={1000000}
                step={10000}
                size="small"
                valueLabelFormat={formatCurrency}
              />
            </Grid>

            {/* Destinations */}
            <Grid item xs={12} md={2}>
              <Autocomplete
                multiple
                size="small"
                options={destinations}
                value={selectedDestinations}
                onChange={(_, newValue) => setSelectedDestinations(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Destinations" variant="outlined" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>

            {/* Search */}
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                }}
                placeholder="Name, phone, destination..."
              />
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Actions</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={selectedLeads.size === 0}
                  onClick={bulkMarkAsContacted}
                  startIcon={<CheckBox />}
                >
                  Mark Contacted ({selectedLeads.size})
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Table */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Table Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" color="text.primary">
                Leads ({filteredLeads.length})
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                    indeterminate={selectedLeads.size > 0 && selectedLeads.size < filteredLeads.length}
                    onChange={selectAllLeads}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Select All
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Refresh sx={{ fontSize: 16 }} />
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                      indeterminate={selectedLeads.size > 0 && selectedLeads.size < filteredLeads.length}
                      onChange={selectAllLeads}
                    />
                  </TableCell>
                  <TableCell>Lead ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Trip Details</TableCell>
                  <TableCell 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort('travelDate')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Travel Date 
                      <Sort sx={{ fontSize: 16, opacity: sortField === 'travelDate' ? 1 : 0.5 }} />
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort('budget')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Budget
                      <Sort sx={{ fontSize: 16, opacity: sortField === 'budget' ? 1 : 0.5 }} />
                    </Box>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Temperature</TableCell>
                  <TableCell 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSort('lastContact')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Last Contact
                      <Sort sx={{ fontSize: 16, opacity: sortField === 'lastContact' ? 1 : 0.5 }} />
                    </Box>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Annotations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <TableRow 
                      hover
                      selected={selectedLeads.has(lead.id)}
                      sx={{ 
                        '& > *': { borderBottom: 'unset' },
                        backgroundColor: selectedLeads.has(lead.id) ? 'action.selected' : 'inherit'
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedLeads.has(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(lead.id)}
                          >
                            {expandedRows.has(lead.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          <Typography variant="body2" fontWeight="medium">
                            {lead.id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {lead.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lead.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{lead.trip}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {lead.destination}
                            </Typography>
                            <People sx={{ fontSize: 14, color: 'text.secondary', ml: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              {lead.pax} pax
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(lead.travelDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(lead.budget)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            variant="outlined"
                          >
                            {Object.entries(statusConfig).filter(([key]) => key !== 'all').map(([key, config]) => (
                              <MenuItem key={key} value={key}>
                                <Chip
                                  size="small"
                                  label={config.label}
                                  sx={{
                                    backgroundColor: config.color,
                                    color: '#fff',
                                    fontSize: '0.75rem'
                                  }}
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          {Object.entries(temperatureConfig).map(([key, config]) => (
                            <IconButton
                              key={key}
                              size="small"
                              onClick={() => updateLeadTemperature(lead.id, key)}
                              sx={{
                                backgroundColor: lead.temperature === key ? `${config.color}20` : 'transparent',
                                border: lead.temperature === key ? `1px solid ${config.color}` : '1px solid transparent',
                                '&:hover': {
                                  backgroundColor: `${config.color}20`,
                                }
                              }}
                            >
                              <Typography fontSize="16px">{config.emoji}</Typography>
                            </IconButton>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(lead.lastContact)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Call">
                            <IconButton size="small" color="success">
                              <Phone fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="WhatsApp">
                            <IconButton size="small" sx={{ color: '#25D366' }}>
                              <WhatsApp fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Email">
                            <IconButton size="small" color="primary">
                              <Email fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Schedule">
                            <IconButton size="small" color="warning">
                              <Schedule fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 200 }}>
                          {editingAnnotation === lead.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <TextField
                                size="small"
                                value={newAnnotation}
                                onChange={(e) => setNewAnnotation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && updateAnnotation(lead.id, newAnnotation)}
                                sx={{ flexGrow: 1 }}
                                autoFocus
                              />
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => updateAnnotation(lead.id, newAnnotation)}
                              >
                                <Send fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setEditingAnnotation(null);
                                  setNewAnnotation('');
                                }}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  flexGrow: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {lead.annotations || 'No notes'}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingAnnotation(lead.id);
                                  setNewAnnotation(lead.annotations || '');
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row Details */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                        <Collapse in={expandedRows.has(lead.id)} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Grid container spacing={3}>
                              {/* Lead Details */}
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Lead Details
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="body2" color="text.secondary">
                                        <strong>Agent:</strong> {lead.agent}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        <strong>Notes:</strong> {lead.notes}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        <strong>Full Annotations:</strong> {lead.annotations}
                                      </Typography>
                                    </Box>
                                    
                                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                      <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Assign Agent</InputLabel>
                                        <Select
                                          value=""
                                          label="Assign Agent"
                                        >
                                          {agents.map(agent => (
                                            <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                      <Button size="small" variant="contained" sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#20c157' } }}>
                                        WhatsApp Template
                                      </Button>
                                      <Button size="small" variant="contained" color="primary">
                                        Email Template
                                      </Button>
                                      <Button size="small" variant="contained" color="warning">
                                        Schedule Follow-up
                                      </Button>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Communication History */}
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Communication History
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                      {lead.communications.map((comm, index) => (
                                        <Box
                                          key={index}
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 2,
                                            p: 1.5,
                                            mb: 1,
                                            backgroundColor: 'background.paper',
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1
                                          }}
                                        >
                                          <Avatar
                                            sx={{
                                              width: 24,
                                              height: 24,
                                              backgroundColor: 
                                                comm.type === 'call' ? '#4CAF50' :
                                                comm.type === 'email' ? '#2196F3' : '#9C27B0'
                                            }}
                                          >
                                            {comm.type === 'call' ? <Phone sx={{ fontSize: 14 }} /> :
                                             comm.type === 'email' ? <Email sx={{ fontSize: 14 }} /> :
                                             <WhatsApp sx={{ fontSize: 14 }} />}
                                          </Avatar>
                                          <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                              {formatDate(comm.date)}
                                            </Typography>
                                            <Typography variant="body2">
                                              {comm.note}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      ))}
                                    </Box>
                                    
                                    <Button
                                      fullWidth
                                      variant="outlined"
                                      startIcon={<Add />}
                                      sx={{ 
                                        borderStyle: 'dashed',
                                        borderColor: 'divider',
                                        color: 'text.secondary'
                                      }}
                                    >
                                      Add Communication Log
                                    </Button>
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Search sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" color="text.primary" gutterBottom>
                No leads found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Export Options & Floating Action Button */}
        <Grid container spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
              Showing {filteredLeads.length} of {leads.length} leads
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                color="primary"
                fullWidth={true}
                sx={{ minWidth: 120 }}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                color="primary"
                fullWidth={true}
                sx={{ minWidth: 120 }}
              >
                Export PDF
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Floating Action Button - Responsive */}
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1200 }}>
          <Tooltip title="Add New Lead" arrow>
            <Fab
              color="primary"
              sx={{ boxShadow: theme.shadows[8], width: { xs: 56, md: 64 }, height: { xs: 56, md: 64 } }}
            >
              <Add sx={{ fontSize: { xs: 28, md: 32 } }} />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
    </ThemeProvider>
  );
}