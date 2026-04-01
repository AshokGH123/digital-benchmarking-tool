import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  MonitorHeart,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { processService } from '../services/process';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProcessHealth = () => {
  const { mode } = useTheme();
  const [processes, setProcesses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    processName: '',
    benchmarkTime: '',
    benchmarkCost: '',
    actualTime: '',
    actualCost: '',
    errorRate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [processRes, alertRes] = await Promise.all([
        processService.getProcesses(),
        processService.getAlerts(),
      ]);
      setProcesses(processRes.data || []);
      setAlerts(alertRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleOpen = (process = null) => {
    if (process) {
      setEditingId(process._id);
      setFormData({
        processName: process.processName,
        benchmarkTime: process.benchmarkTime,
        benchmarkCost: process.benchmarkCost,
        actualTime: process.actualTime,
        actualCost: process.actualCost,
        errorRate: process.errorRate,
      });
    } else {
      setEditingId(null);
      setFormData({
        processName: '',
        benchmarkTime: '',
        benchmarkCost: '',
        actualTime: '',
        actualCost: '',
        errorRate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        benchmarkTime: parseFloat(formData.benchmarkTime),
        benchmarkCost: parseFloat(formData.benchmarkCost),
        actualTime: parseFloat(formData.actualTime),
        actualCost: parseFloat(formData.actualCost),
        errorRate: parseFloat(formData.errorRate),
      };

      if (editingId) {
        await processService.updateProcess(editingId, payload);
      } else {
        await processService.createProcess(payload);
      }
      fetchData();
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save process');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this process?')) {
      try {
        await processService.deleteProcess(id);
        fetchData();
      } catch (error) {
        toast.error('Failed to delete process');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Good': return '#34C759';
      case 'Moderate': return '#FF9500';
      case 'Poor': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Good': return <CheckCircle />;
      case 'Moderate': return <Warning />;
      case 'Poor': return <ErrorIcon />;
      default: return <MonitorHeart />;
    }
  };

  const chartData = processes.map(p => ({
    name: p.processName.substring(0, 10),
    score: p.healthScore,
  }));

  const avgHealthScore = processes.length > 0
    ? Math.round(processes.reduce((sum, p) => sum + p.healthScore, 0) / processes.length)
    : 0;

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Process Health Monitor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time process health tracking and alerts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Add Process
        </Button>
      </Box>

      {alerts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {alerts.length} Active Alert{alerts.length > 1 ? 's' : ''}
          </Typography>
          {alerts.slice(0, 3).map((alert, idx) => (
            <Typography key={idx} variant="body2">
              • {alert.processName}: {alert.message}
            </Typography>
          ))}
        </Alert>
      )}

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total Processes</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{processes.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Avg Health Score</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{avgHealthScore}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Good Status</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#34C759' }}>
                {processes.filter(p => p.status === 'Good').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Critical</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF3B30' }}>
                {processes.filter(p => p.status === 'Poor').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {processes.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Health Score Trends
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={mode === 'light' ? '#e0e0e0' : '#333'} />
              <XAxis dataKey="name" stroke={mode === 'light' ? '#666' : '#999'} />
              <YAxis stroke={mode === 'light' ? '#666' : '#999'} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: mode === 'light' ? '#fff' : '#1c1c1e', border: 'none', borderRadius: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#007AFF" strokeWidth={2} name="Health Score" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Process List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Process Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Health Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Cost</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Error Rate</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process._id} hover>
                  <TableCell>{process.processName}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {process.healthScore}%
                      </Typography>
                      {process.healthScore > 80 ? <TrendingUp sx={{ color: '#34C759' }} /> : <TrendingDown sx={{ color: '#FF3B30' }} />}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={getStatusIcon(process.status)}
                      label={process.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(process.status)}20`,
                        color: getStatusColor(process.status),
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {process.actualTime}h / {process.benchmarkTime}h
                  </TableCell>
                  <TableCell align="right">
                    ${process.actualCost} / ${process.benchmarkCost}
                  </TableCell>
                  <TableCell align="right">{process.errorRate}%</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpen(process)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(process._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Process' : 'Add Process'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Process Name"
                  name="processName"
                  value={formData.processName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Benchmark Time (hrs)"
                  name="benchmarkTime"
                  value={formData.benchmarkTime}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Actual Time (hrs)"
                  name="actualTime"
                  value={formData.actualTime}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Benchmark Cost ($)"
                  name="benchmarkCost"
                  value={formData.benchmarkCost}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Actual Cost ($)"
                  name="actualCost"
                  value={formData.actualCost}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Error Rate (%)"
                  name="errorRate"
                  value={formData.errorRate}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 100 }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProcessHealth;
