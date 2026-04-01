import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import { Person, Palette, Notifications, Security } from '@mui/icons-material';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
  'Education', 'Real Estate', 'Hospitality', 'Transportation', 'Other'
];

const Settings = () => {
  const { mode, toggleTheme } = useAppTheme();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    industry: user?.industry || '',
  });
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateProfile(formData);
      updateUser(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success('Notification preferences updated');
  };

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage your account and preferences
      </Typography>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto 16px',
                fontSize: 40,
                fontWeight: 700,
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                  : 'linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%)',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mt: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Palette />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Appearance
              </Typography>
            </Box>
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
              label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Person />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Profile Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  {industries.map((ind) => (
                    <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 2.5 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Notifications />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
              }
              label="Email Notifications"
            />
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Receive email updates about your benchmarks
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
              }
              label="Push Notifications"
            />
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Get push notifications for important updates
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.weekly}
                  onChange={() => handleNotificationChange('weekly')}
                />
              }
              label="Weekly Summary"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Receive weekly performance summaries
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Security />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Account Security
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your account is secured with industry-standard encryption
            </Typography>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>
              Change Password
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
