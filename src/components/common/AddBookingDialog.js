import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { BASE_URL } from '../../endpoints';

const AddBookingDialog = ({ open, onClose, onBookingAdded, getToken }) => {
    const [formData, setFormData] = useState({
        tripName: '',
        startDate: null,
        endDate: null,
        adults: 1,
        children: 0,
        price: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.tripName || !formData.price || !formData.firstName || !formData.email) {
            // Basic validation
            alert("Please fill all required fields: Destination/Trip, Price, First Name, and Email.");
            return;
        }

        const bookingData = {
            tripName: formData.tripName,
            startDate: formData.startDate ? dayjs(formData.startDate).format("YYYY-MM-DD") : null,
            endDate: formData.endDate ? dayjs(formData.endDate).format("YYYY-MM-DD") : null,
            attendees: {
              adults: Number(formData.adults) || 1,
              children: Number(formData.children) || 0,
            },
            price: Number(formData.price),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            isManual: true, // Flag for manually added bookings
          };

        try {
            const token = await getToken();
            const response = await fetch(`${BASE_URL}/api/bookings`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) throw new Error("Failed to create booking.");
            
            onBookingAdded();
            onClose();

        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Error creating booking: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Add New Lead / Booking</DialogTitle>
            <DialogContent dividers>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={3} sx={{ pt: 2 }}>
                        <Grid item xs={12}><TextField fullWidth required label="Destination / Trip Name" value={formData.tripName} onChange={(e) => handleFormChange('tripName', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth required label="First Name" value={formData.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={formData.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth required type="email" label="Email" value={formData.email} onChange={(e) => handleFormChange('email', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => handleFormChange('phone', e.target.value)} /></Grid>
                        <Grid item xs={12} sm={6}><DatePicker label="Start Date" sx={{width: '100%'}} value={formData.startDate} onChange={(date) => handleFormChange('startDate', date)} /></Grid>
                        <Grid item xs={12} sm={6}><DatePicker label="End Date" sx={{width: '100%'}} value={formData.endDate} onChange={(date) => handleFormChange('endDate', date)} minDate={formData.startDate ? dayjs(formData.startDate).add(1, "day") : undefined} /></Grid>
                        <Grid item xs={6} sm={4}><TextField fullWidth type="number" label="Adults" value={formData.adults} onChange={(e) => handleFormChange('adults', e.target.value)} InputProps={{ inputProps: { min: 1 } }} /></Grid>
                        <Grid item xs={6} sm={4}><TextField fullWidth type="number" label="Children" value={formData.children} onChange={(e) => handleFormChange('children', e.target.value)} InputProps={{ inputProps: { min: 0 } }} /></Grid>
                        <Grid item xs={12} sm={4}><TextField fullWidth required type="number" label="Price (₹)" value={formData.price} onChange={(e) => handleFormChange('price', e.target.value)} /></Grid>
                    </Grid>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Create Booking</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBookingDialog;