// src/components/admin/bookings/bookingsUtils.js
// Pure helpers for the admin bookings module: formatting, filtering,
// contact links and CSV export. No React, no side effects (except download).

import { STATUS_CONFIG, TEMPERATURE_CONFIG } from './bookingsConfig';

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

export const formatDate = (date) => {
  if (!date) return '—';
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const todayIsoDate = () => new Date().toISOString().split('T')[0];

const toIsoDate = (date) => date.toISOString().split('T')[0];

export const getDatePresetRange = (preset) => {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  switch (preset) {
    case 'this_week': {
      start.setDate(today.getDate() - today.getDay());
      end.setTime(start.getTime());
      end.setDate(start.getDate() + 6);
      break;
    }
    case 'next_7_days':
      end.setDate(today.getDate() + 7);
      break;
    case 'this_month':
      start.setDate(1);
      end.setMonth(today.getMonth() + 1, 0);
      break;
    default:
      return null;
  }

  return { start: toIsoDate(start), end: toIsoDate(end) };
};

export const filterBookings = (bookings, filters) => {
  const rawSearch = (filters.search || '').trim();
  const search = rawSearch.toLowerCase();
  const { start, end } = filters.dateRange || {};
  const [minBudget, maxBudget] = filters.budgetRange || [0, Number.MAX_SAFE_INTEGER];

  return bookings.filter((booking) => {
    const matchesSearch =
      !search ||
      (booking.customerName || '').toLowerCase().includes(search) ||
      (booking.phone || '').includes(rawSearch) ||
      (booking.destination || '').toLowerCase().includes(search) ||
      (booking.trip || '').toLowerCase().includes(search);

    const matchesStatus = filters.status === 'all' || booking.status === filters.status;

    const matchesTemperature =
      filters.temperature === 'all' || booking.temperature === filters.temperature;

    const matchesDateRange =
      !start ||
      !end ||
      (new Date(booking.travelDate) >= new Date(start) &&
        new Date(booking.travelDate) <= new Date(end));

    const budget = booking.budget ?? 0;
    const matchesBudget = budget >= minBudget && budget <= maxBudget;

    const matchesDestination =
      !filters.destinations?.length || filters.destinations.includes(booking.destination);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesTemperature &&
      matchesDateRange &&
      matchesBudget &&
      matchesDestination
    );
  });
};

export const countByField = (bookings, field) =>
  bookings.reduce((acc, booking) => {
    const key = booking[field];
    if (key) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

// ---------------------------------------------------------------------------
// Contact links
// ---------------------------------------------------------------------------

const phoneDigits = (phone = '') => phone.replace(/[^\d+]/g, '');

export const telHref = (phone) => `tel:${phoneDigits(phone)}`;

export const whatsAppHref = (phone, message = '') => {
  const number = phoneDigits(phone).replace(/^\+/, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${query}`;
};

export const whatsAppTemplate = (booking) =>
  `Hi ${booking.customerName}, thank you for your interest in "${booking.trip}". ` +
  `I'd love to help you plan your travel around ${formatDate(booking.travelDate)} ` +
  `for ${booking.pax} traveller(s). When would be a good time to talk?`;

export const emailTemplateHref = (booking) => {
  const subject = encodeURIComponent(`Your ${booking.trip} enquiry — TravelTrail`);
  const body = encodeURIComponent(
    `Hi ${booking.customerName},\n\n` +
      `Thank you for your enquiry about "${booking.trip}" (${booking.destination}) ` +
      `for ${booking.pax} traveller(s) around ${formatDate(booking.travelDate)}.\n\n` +
      `Please find the details of your itinerary below.\n\nBest regards,\nTravelTrail Team`
  );
  return `mailto:?subject=${subject}&body=${body}`;
};

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

const CSV_COLUMNS = [
  ['id', 'Lead ID'],
  ['customerName', 'Customer'],
  ['phone', 'Phone'],
  ['trip', 'Trip'],
  ['destination', 'Destination'],
  ['travelDate', 'Travel Date'],
  ['pax', 'Pax'],
  ['budget', 'Budget (INR)'],
  ['status', 'Status'],
  ['temperature', 'Temperature'],
  ['lastContact', 'Last Contact'],
  ['agent', 'Agent'],
  ['notes', 'Notes'],
  ['annotations', 'Annotations'],
];

const escapeCsvValue = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const csvCellValue = (booking, key) => {
  if (key === 'status') return STATUS_CONFIG[booking.status]?.label ?? booking.status;
  if (key === 'temperature') {
    return TEMPERATURE_CONFIG[booking.temperature]?.label ?? booking.temperature;
  }
  return booking[key];
};

export const bookingsToCsv = (bookings) => {
  const header = CSV_COLUMNS.map(([, label]) => escapeCsvValue(label)).join(',');
  const rows = bookings.map((booking) =>
    CSV_COLUMNS.map(([key]) => escapeCsvValue(csvCellValue(booking, key))).join(',')
  );
  return [header, ...rows].join('\n');
};

export const downloadCsv = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
