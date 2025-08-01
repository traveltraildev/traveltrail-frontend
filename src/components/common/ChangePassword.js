// src/components/common/ChangePassword.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changeUserPassword } from '../../api/userAPI';
import { Box, Typography, TextField, Button, Alert, Container } from '@mui/material';

const ChangePassword = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await changeUserPassword(user._id, formData);
      setSuccess(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password changed successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            '& .MuiTextField-root': { mb: 3, width: '100%' },
          }}
        >
          <TextField
            label="Current Password"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
            fullWidth
            variant="outlined"
            helperText="At least 8 characters long"
            error={!!error && formData.newPassword.length < 8}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            fullWidth
            variant="outlined"
            error={!!error && formData.newPassword !== formData.confirmPassword}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: 'var(--primary-500)',
            color: 'white',
            '&:hover': { bgcolor: 'var(--primary-600)' },
            px: 3,
            py: 1.5,
            borderRadius: '8px',
            mt: 2
          }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Change Password'}
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;