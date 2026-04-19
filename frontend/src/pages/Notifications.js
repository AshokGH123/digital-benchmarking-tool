import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { mode } = useTheme();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return '#34C759';
      case 'failed': return '#FF3B30';
      case 'pending': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'benchmark_complete': return 'Benchmark Report';
      case 'performance_alert': return 'Performance Alert';
      case 'weekly_report': return 'Weekly Report';
      case 'monthly_report': return 'Monthly Report';
      default: return type;
    }
  };

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Email Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your email notification history
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Weekly report sending is temporarily unavailable in this deployment. Your saved notification history is still available below.
      </Alert>

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total Sent</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {notifications.filter(n => n.status === 'sent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Failed</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF3B30' }}>
                {notifications.filter(n => n.status === 'failed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Pending</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9500' }}>
                {notifications.filter(n => n.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">This Week</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {notifications.filter(n => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(n.createdAt) > weekAgo;
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Notification History
        </Typography>

        {notifications.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Email sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>No Notifications Yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Email notifications will appear here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {notifications.map((notification) => (
              <Grid item xs={12} key={notification._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Email sx={{ color: mode === 'light' ? '#007AFF' : '#0A84FF' }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {notification.subject}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1} mb={2}>
                          <Chip
                            label={getTypeLabel(notification.type)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip
                            icon={notification.status === 'sent' ? <CheckCircle /> : <ErrorIcon />}
                            label={notification.status.toUpperCase()}
                            size="small"
                            sx={{
                              background: `${getStatusColor(notification.status)}20`,
                              color: getStatusColor(notification.status),
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          To: {notification.recipient}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5} mt={1}>
                          <Schedule fontSize="small" />
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Notifications;
