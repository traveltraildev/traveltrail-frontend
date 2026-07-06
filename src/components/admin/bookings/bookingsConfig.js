// src/components/admin/bookings/bookingsConfig.js
// Shared configuration for the admin bookings module.
// Colors are MUI palette keys (success/warning/error/info/primary/secondary)
// so they can be passed straight to `color` props or `palette[key]` lookups —
// never hardcoded hex values.

export const STATUS_CONFIG = {
  new: { label: 'New', color: 'info' },
  contacted: { label: 'Contacted', color: 'primary' },
  itinerary_shared: { label: 'Itinerary Shared', color: 'warning' },
  quotation_sent: { label: 'Quotation Sent', color: 'secondary' },
  booked: { label: 'Booked', color: 'success' },
  lost: { label: 'Lost', color: 'error' },
};

// The pipeline filter row also offers an "all" pseudo-status.
export const STATUS_FILTERS = {
  all: { label: 'All Leads', color: 'default' },
  ...STATUS_CONFIG,
};

export const TEMPERATURE_CONFIG = {
  hot: { label: 'Hot', emoji: '\u{1F525}', color: 'error' },
  warm: { label: 'Warm', emoji: '\u{1F321}\u{FE0F}', color: 'warning' },
  cold: { label: 'Cold', emoji: '\u{1F9CA}', color: 'info' },
};

export const DESTINATIONS = [
  'Kashmir',
  'Goa',
  'Rajasthan',
  'Kerala',
  'Himachal Pradesh',
  'Uttarakhand',
  'Maharashtra',
  'Karnataka',
];

export const AGENTS = [
  'Priya Sharma',
  'Amit Singh',
  'Kavita Joshi',
  'Rohit Mehta',
  'Neha Gupta',
];

export const BUDGET_MAX = 1000000;
export const BUDGET_STEP = 10000;

export const DATE_PRESETS = [
  { key: 'this_week', label: 'This Week' },
  { key: 'next_7_days', label: 'Next 7 Days' },
  { key: 'this_month', label: 'This Month' },
];

export const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  temperature: 'all',
  dateRange: { start: '', end: '' },
  budgetRange: [0, BUDGET_MAX],
  destinations: [],
};
