import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';
import { useBenchmarks } from '../context/BenchmarkContext';

const Analytics = () => {
  const [benchmarks, setBenchmarks] = useState([]);
  const { benchmarks: globalBenchmarks, fetchBenchmarks } = useBenchmarks();

  useEffect(() => {
    if (globalBenchmarks.length > 0) {
      setBenchmarks(globalBenchmarks);
      return;
    }

    fetchBenchmarks()
      .then((data) => setBenchmarks(data))
      .catch((error) => {
        toast.error(error?.message || 'Failed to load analytics data');
      });
  }, [globalBenchmarks, fetchBenchmarks]);

  const averages = useMemo(() => {
    if (benchmarks.length === 0) return null;
    const totals = {
      websiteTraffic: 0,
      conversionRate: 0,
      socialMediaEngagement: 0,
      customerSatisfaction: 0,
      revenueGrowth: 0,
      operationalEfficiency: 0,
    };
    benchmarks.forEach((b) => {
      Object.keys(totals).forEach((k) => {
        totals[k] += Number(b.metrics[k] || 0);
      });
    });
    const count = benchmarks.length;
    return Object.fromEntries(
      Object.entries(totals).map(([k, v]) => [k, Number((v / count).toFixed(2))])
    );
  }, [benchmarks]);

  const trendData = useMemo(() => {
    return benchmarks
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((b) => ({
        name: `${b.quarter} ${b.year}`,
        revenueGrowth: Number(b.metrics.revenueGrowth || 0),
        operationalEfficiency: Number(b.metrics.operationalEfficiency || 0),
        conversionRate: Number(b.metrics.conversionRate || 0),
      }));
  }, [benchmarks]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Explore trends, correlations, and performance drivers across your benchmarks.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenueGrowth" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="operationalEfficiency" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="conversionRate" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average KPIs
            </Typography>
            {averages ? (
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip label={`Traffic: ${averages.websiteTraffic}`} />
                <Chip label={`Conversion: ${averages.conversionRate}`} />
                <Chip label={`Engagement: ${averages.socialMediaEngagement}`} />
                <Chip label={`Satisfaction: ${averages.customerSatisfaction}`} />
                <Chip label={`Revenue: ${averages.revenueGrowth}`} />
                <Chip label={`Efficiency: ${averages.operationalEfficiency}`} />
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Add benchmarks to view analytics.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
