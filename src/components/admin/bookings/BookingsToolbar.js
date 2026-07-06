// src/components/admin/bookings/BookingsToolbar.js
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {
  BUDGET_MAX,
  BUDGET_STEP,
  DATE_PRESETS,
  DESTINATIONS,
  STATUS_FILTERS,
  TEMPERATURE_CONFIG,
} from './bookingsConfig';
import { formatCurrency, formatDate, getDatePresetRange } from './bookingsUtils';

const FieldLabel = ({ children }) => (
  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
    {children}
  </Typography>
);

/**
 * Filter and bulk-action bar for the bookings dashboard. Fully controlled:
 * receives `filters` and reports changes through `onFiltersChange(patch)`.
 */
export default function BookingsToolbar({
  filters,
  onFiltersChange,
  statusCounts,
  temperatureCounts,
  selectedCount,
  onBulkMarkContacted,
  lastUpdated,
  onRefresh,
}) {
  const hasDateRange = Boolean(filters.dateRange.start && filters.dateRange.end);

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 2,
        position: { xs: 'static', md: 'sticky' },
        top: { md: '76px' }, // stays below the fixed 68px navbar
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      {/* Status pipeline */}
      <Typography variant="h6" sx={{ mb: 1.5, color: 'text.primary' }}>
        Lead Pipeline
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {Object.entries(STATUS_FILTERS).map(([key, config]) => (
          <Chip
            key={key}
            clickable
            label={`${config.label} (${statusCounts[key] || 0})`}
            color={config.color}
            variant={filters.status === key ? 'filled' : 'outlined'}
            onClick={() =>
              onFiltersChange({ status: filters.status === key ? 'all' : key })
            }
          />
        ))}
      </Stack>

      {/* Filters */}
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          alignItems: 'start',
        }}
      >
        <Box>
          <FieldLabel>Search</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={filters.search}
            onChange={(event) => onFiltersChange({ search: event.target.value })}
            placeholder="Name, phone, trip, destination..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'action.active' }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ 'aria-label': 'Search bookings' }}
          />
        </Box>

        <Box>
          <FieldLabel>Destinations</FieldLabel>
          <Autocomplete
            multiple
            size="small"
            options={DESTINATIONS}
            value={filters.destinations}
            onChange={(_, newValue) => onFiltersChange({ destinations: newValue })}
            renderInput={(params) => (
              <TextField {...params} placeholder="All destinations" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Box>

        <Box>
          <FieldLabel>Temperature</FieldLabel>
          <Stack direction="row" spacing={1}>
            {Object.entries(TEMPERATURE_CONFIG).map(([key, config]) => (
              <Tooltip key={key} title={`${config.label} (${temperatureCounts[key] || 0})`}>
                <Chip
                  size="small"
                  clickable
                  label={`${config.emoji} ${temperatureCounts[key] || 0}`}
                  color={config.color}
                  variant={filters.temperature === key ? 'filled' : 'outlined'}
                  onClick={() =>
                    onFiltersChange({
                      temperature: filters.temperature === key ? 'all' : key,
                    })
                  }
                />
              </Tooltip>
            ))}
          </Stack>
        </Box>

        <Box>
          <FieldLabel>Travel Date</FieldLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {DATE_PRESETS.map((preset) => (
              <Button
                key={preset.key}
                size="small"
                variant="outlined"
                onClick={() => onFiltersChange({ dateRange: getDatePresetRange(preset.key) })}
                sx={{ fontSize: '0.75rem', minWidth: 'auto', minHeight: 32, px: 1 }}
              >
                {preset.label}
              </Button>
            ))}
          </Stack>
          {hasDateRange && (
            <Chip
              size="small"
              sx={{ mt: 1 }}
              label={`${formatDate(filters.dateRange.start)} – ${formatDate(filters.dateRange.end)}`}
              onDelete={() => onFiltersChange({ dateRange: { start: '', end: '' } })}
            />
          )}
        </Box>

        <Box sx={{ px: 1 }}>
          <FieldLabel>
            Budget: {formatCurrency(filters.budgetRange[0])} –{' '}
            {formatCurrency(filters.budgetRange[1])}
          </FieldLabel>
          <Slider
            value={filters.budgetRange}
            onChange={(_, newValue) => onFiltersChange({ budgetRange: newValue })}
            valueLabelDisplay="auto"
            min={0}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            size="small"
            valueLabelFormat={formatCurrency}
            getAriaLabel={() => 'Budget range'}
          />
        </Box>

        <Box>
          <FieldLabel>Quick Actions</FieldLabel>
          <Button
            size="small"
            variant="contained"
            color="primary"
            disabled={selectedCount === 0}
            onClick={onBulkMarkContacted}
            startIcon={<DoneAllIcon />}
          >
            Mark Contacted ({selectedCount})
          </Button>
        </Box>
      </Box>

      {/* Meta row */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2 }}>
        <Tooltip title="Reload bookings">
          <IconButton size="small" onClick={onRefresh} aria-label="Reload bookings">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      </Stack>
    </Paper>
  );
}
