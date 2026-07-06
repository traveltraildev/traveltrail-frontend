// src/components/admin/bookings/BookingDetailsDialog.js
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleIcon from '@mui/icons-material/People';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BookingStatusChip, {
  BookingStatusSelect,
  TemperatureToggle,
} from './BookingStatusChip';
import { AGENTS } from './bookingsConfig';
import {
  emailTemplateHref,
  formatCurrency,
  formatDate,
  telHref,
  todayIsoDate,
  whatsAppHref,
  whatsAppTemplate,
} from './bookingsUtils';

const COMMUNICATION_ICONS = {
  call: { icon: PhoneIcon, color: 'success.main' },
  email: { icon: EmailIcon, color: 'info.main' },
  whatsapp: { icon: WhatsAppIcon, color: 'secondary.main' },
  note: { icon: AssignmentIcon, color: 'grey.500' },
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
    <Typography variant="body2" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight="medium">
      {value}
    </Typography>
  </Stack>
);

/**
 * Full booking/lead detail view. Replaces the old expandable table rows:
 * trip summary, contact actions, status/temperature/agent management,
 * internal notes (annotations) and the communication history.
 */
export default function BookingDetailsDialog({
  open,
  booking,
  onClose,
  onStatusChange,
  onTemperatureChange,
  onAgentChange,
  onSaveAnnotation,
  onAddCommunication,
}) {
  const [annotationDraft, setAnnotationDraft] = useState('');
  const [logDraft, setLogDraft] = useState('');

  const bookingId = booking ? booking.id : null;

  // Reset drafts only when a different booking is opened.
  useEffect(() => {
    if (booking) {
      setAnnotationDraft(booking.annotations || '');
      setLogDraft('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, open]);

  if (!booking) return null;

  const annotationDirty = annotationDraft !== (booking.annotations || '');

  const handleLogSubmit = () => {
    const note = logDraft.trim();
    if (!note) return;
    onAddCommunication(booking.id, { type: 'note', date: todayIsoDate(), note });
    setLogDraft('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 7 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" component="span">
            {booking.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {booking.id}
          </Typography>
          <BookingStatusChip status={booking.status} />
        </Stack>
        <IconButton
          onClick={onClose}
          aria-label="Close details"
          sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            alignItems: 'start',
          }}
        >
          {/* Trip & contact */}
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Trip Details
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body1">{booking.trip}</Typography>
                  <InfoRow icon={LocationOnIcon} label="Destination" value={booking.destination} />
                  <InfoRow
                    icon={CalendarMonthIcon}
                    label="Travel date"
                    value={formatDate(booking.travelDate)}
                  />
                  <InfoRow icon={PeopleIcon} label="Travellers" value={`${booking.pax} pax`} />
                  <InfoRow icon={PaymentsIcon} label="Budget" value={formatCurrency(booking.budget)} />
                </Stack>
                {booking.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    <strong>Notes:</strong> {booking.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Contact
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {booking.phone}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<PhoneIcon />}
                    href={telHref(booking.phone)}
                  >
                    Call
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    startIcon={<WhatsAppIcon />}
                    href={whatsAppHref(booking.phone, whatsAppTemplate(booking))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Template
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    startIcon={<EmailIcon />}
                    href={emailTemplateHref(booking)}
                  >
                    Email Template
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Lead Management
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                      Status
                    </Typography>
                    <BookingStatusSelect
                      fullWidth
                      value={booking.status}
                      onChange={(status) => onStatusChange(booking.id, status)}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                      Temperature
                    </Typography>
                    <TemperatureToggle
                      value={booking.temperature}
                      onChange={(temperature) => onTemperatureChange(booking.id, temperature)}
                    />
                  </Box>
                  <FormControl size="small" fullWidth>
                    <InputLabel id="assign-agent-label">Assigned Agent</InputLabel>
                    <Select
                      labelId="assign-agent-label"
                      label="Assigned Agent"
                      value={AGENTS.includes(booking.agent) ? booking.agent : ''}
                      onChange={(event) => onAgentChange(booking.id, event.target.value)}
                    >
                      {AGENTS.map((agent) => (
                        <MenuItem key={agent} value={agent}>
                          {agent}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Notes & communication history */}
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Internal Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  value={annotationDraft}
                  onChange={(event) => setAnnotationDraft(event.target.value)}
                  placeholder="Add internal notes about this lead..."
                />
                <Button
                  size="small"
                  variant="contained"
                  sx={{ mt: 1.5 }}
                  disabled={!annotationDirty}
                  onClick={() => onSaveAnnotation(booking.id, annotationDraft)}
                >
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Communication History
                </Typography>
                <Stack spacing={1} sx={{ mb: 2, maxHeight: 260, overflowY: 'auto' }}>
                  {(booking.communications || []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No communications logged yet.
                    </Typography>
                  )}
                  {(booking.communications || []).map((comm, index) => {
                    const { icon: Icon, color } =
                      COMMUNICATION_ICONS[comm.type] || COMMUNICATION_ICONS.note;
                    return (
                      <Stack
                        key={`${comm.date}-${index}`}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                        sx={{
                          p: 1.5,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Avatar sx={{ width: 24, height: 24, bgcolor: color }}>
                          <Icon sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="caption" color="text.secondary" component="div">
                            {formatDate(comm.date)}
                          </Typography>
                          <Typography variant="body2">{comm.note}</Typography>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={logDraft}
                    onChange={(event) => setLogDraft(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleLogSubmit()}
                    placeholder="Log a call, message or note..."
                    inputProps={{ 'aria-label': 'New communication log entry' }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SendIcon />}
                    disabled={!logDraft.trim()}
                    onClick={handleLogSubmit}
                  >
                    Log
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
