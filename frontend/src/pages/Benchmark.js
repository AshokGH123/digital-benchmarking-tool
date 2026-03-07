import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useBenchmarks } from '../context/BenchmarkContext';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const defaultMetrics = {
  websiteTraffic: '',
  conversionRate: '',
  socialMediaEngagement: '',
  customerSatisfaction: '',
  revenueGrowth: '',
  operationalEfficiency: '',
};

const buildInitialForm = () => ({
  industry: '',
  quarter: 'Q1',
  year: new Date().getFullYear(),
  notes: '',
  metrics: { ...defaultMetrics },
});

const Benchmark = () => {
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(buildInitialForm());
  const { benchmarks, fetchBenchmarks, createBenchmark, updateBenchmark, deleteBenchmark } = useBenchmarks();

  useEffect(() => {
    fetchBenchmarks().catch(() => {
      toast.error('Failed to load benchmarks');
    });
  }, [fetchBenchmarks]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(buildInitialForm());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metrics.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [key]: value === '' ? '' : value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        metrics: Object.fromEntries(
          Object.entries(formData.metrics).map(([key, value]) => [
            key,
            value === '' ? 0 : Number(value),
          ])
        ),
      };

      if (editingId) {
        await updateBenchmark(editingId, payload);
      } else {
        await createBenchmark(payload);
      }

      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      industry: item.industry,
      quarter: item.quarter,
      year: item.year,
      notes: item.notes || '',
      metrics: {
        websiteTraffic: item.metrics.websiteTraffic,
        conversionRate: item.metrics.conversionRate,
        socialMediaEngagement: item.metrics.socialMediaEngagement,
        customerSatisfaction: item.metrics.customerSatisfaction,
        revenueGrowth: item.metrics.revenueGrowth,
        operationalEfficiency: item.metrics.operationalEfficiency,
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteBenchmark(id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Benchmark Entry
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Add a new benchmark and compare against your historical performance.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Edit Benchmark' : 'New Benchmark'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Quarter"
                name="quarter"
                value={formData.quarter}
                onChange={handleChange}
              >
                {QUARTERS.map((q) => (
                  <MenuItem key={q} value={q}>
                    {q}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Website Traffic"
                name="metrics.websiteTraffic"
                inputProps={{ min: 0, step: 'any' }}
                value={formData.metrics.websiteTraffic}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Conversion Rate"
                name="metrics.conversionRate"
                inputProps={{ min: 0, max: 100, step: 'any' }}
                value={formData.metrics.conversionRate}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Social Engagement"
                name="metrics.socialMediaEngagement"
                inputProps={{ min: 0, step: 'any' }}
                value={formData.metrics.socialMediaEngagement}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Customer Satisfaction"
                name="metrics.customerSatisfaction"
                inputProps={{ min: 0, max: 100, step: 'any' }}
                value={formData.metrics.customerSatisfaction}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Revenue Growth"
                name="metrics.revenueGrowth"
                inputProps={{ step: 'any' }}
                value={formData.metrics.revenueGrowth}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Operational Efficiency"
                name="metrics.operationalEfficiency"
                inputProps={{ min: 0, max: 100, step: 'any' }}
                value={formData.metrics.operationalEfficiency}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingId ? 'Update Benchmark' : 'Save Benchmark'}
            </Button>
            {editingId && (
              <Button variant="outlined" size="large" onClick={resetForm} sx={{ ml: 1 }}>
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Benchmarks
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {benchmarks.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No benchmarks yet.
          </Typography>
        ) : (
          <List>
            {benchmarks.slice(0, 10).map((item) => (
              <ListItem key={item.id} alignItems="flex-start">
                <ListItemText
                  primary={`${item.industry} - ${item.quarter} ${item.year}`}
                  secondary={
                    <Stack spacing={1} mt={1}>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip size="small" label={`Traffic: ${item.metrics.websiteTraffic}`} />
                        <Chip size="small" label={`Conversion: ${item.metrics.conversionRate}`} />
                        <Chip size="small" label={`Engagement: ${item.metrics.socialMediaEngagement}`} />
                        <Chip size="small" label={`Satisfaction: ${item.metrics.customerSatisfaction}`} />
                        <Chip size="small" label={`Revenue: ${item.metrics.revenueGrowth}`} />
                        <Chip size="small" label={`Efficiency: ${item.metrics.operationalEfficiency}`} />
                      </Box>
                      <Box>
                        <Button size="small" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </Box>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Benchmark;
