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
} from '@mui/material';
import toast from 'react-hot-toast';
import { benchmarkService } from '../services/benchmark';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

const Benchmark = () => {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    quarter: 'Q1',
    year: new Date().getFullYear(),
    notes: '',
    metrics: {
      websiteTraffic: '',
      conversionRate: '',
      socialMediaEngagement: '',
      customerSatisfaction: '',
      revenueGrowth: '',
      operationalEfficiency: '',
    },
  });

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const fetchBenchmarks = async () => {
    try {
      const response = await benchmarkService.getBenchmarks();
      setBenchmarks(response.data || []);
    } catch (error) {
      toast.error('Failed to load benchmarks');
    }
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
    setLoading(true);
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
      await benchmarkService.createBenchmark(payload);
      toast.success('Benchmark created');
      setFormData((prev) => ({
        ...prev,
        notes: '',
        metrics: {
          websiteTraffic: '',
          conversionRate: '',
          socialMediaEngagement: '',
          customerSatisfaction: '',
          revenueGrowth: '',
          operationalEfficiency: '',
        },
      }));
      fetchBenchmarks();
    } catch (error) {
      toast.error(error || 'Failed to create benchmark');
    } finally {
      setLoading(false);
    }
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
          New Benchmark
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Benchmark'}
            </Button>
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
                  primary={`${item.industry} • ${item.quarter} ${item.year}`}
                  secondary={
                    <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      <Chip size="small" label={`Traffic: ${item.metrics.websiteTraffic}`} />
                      <Chip size="small" label={`Conversion: ${item.metrics.conversionRate}`} />
                      <Chip size="small" label={`Engagement: ${item.metrics.socialMediaEngagement}`} />
                      <Chip size="small" label={`Satisfaction: ${item.metrics.customerSatisfaction}`} />
                      <Chip size="small" label={`Revenue: ${item.metrics.revenueGrowth}`} />
                      <Chip size="small" label={`Efficiency: ${item.metrics.operationalEfficiency}`} />
                    </Box>
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
