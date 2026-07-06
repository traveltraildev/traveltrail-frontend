// src/components/admin/bookings/BookingStatusChip.js
import React from 'react';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { STATUS_CONFIG, TEMPERATURE_CONFIG } from './bookingsConfig';

/** Small chip rendering a booking status with the MUI semantic palette. */
export default function BookingStatusChip({ status, size = 'small', ...chipProps }) {
  const config = STATUS_CONFIG[status];
  return (
    <Chip
      size={size}
      label={config?.label ?? status}
      color={config?.color ?? 'default'}
      {...chipProps}
    />
  );
}

/** Compact select used to change a booking's status inline. */
export function BookingStatusSelect({ value, onChange, fullWidth = false, label }) {
  return (
    <Select
      size="small"
      value={value}
      fullWidth={fullWidth}
      onChange={(event) => onChange(event.target.value)}
      renderValue={(selected) => <BookingStatusChip status={selected} />}
      inputProps={{ 'aria-label': label || 'Booking status' }}
      sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center', py: 0.75 } }}
    >
      {Object.keys(STATUS_CONFIG).map((key) => (
        <MenuItem key={key} value={key}>
          <BookingStatusChip status={key} />
        </MenuItem>
      ))}
    </Select>
  );
}

/** Hot / warm / cold toggle shared by the table and the details dialog. */
export function TemperatureToggle({ value, onChange, size = 'small' }) {
  return (
    <Stack direction="row" spacing={0.5}>
      {Object.entries(TEMPERATURE_CONFIG).map(([key, config]) => {
        const selected = value === key;
        return (
          <Tooltip key={key} title={config.label}>
            <IconButton
              size={size}
              onClick={() => onChange(key)}
              aria-label={`Mark as ${config.label}`}
              aria-pressed={selected}
              sx={(theme) => ({
                border: '1px solid',
                borderColor: selected ? `${config.color}.main` : 'transparent',
                bgcolor: selected
                  ? alpha(theme.palette[config.color].main, 0.12)
                  : 'transparent',
                '&:hover': {
                  bgcolor: alpha(theme.palette[config.color].main, 0.12),
                },
              })}
            >
              <Typography component="span" fontSize={16} lineHeight={1}>
                {config.emoji}
              </Typography>
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}
