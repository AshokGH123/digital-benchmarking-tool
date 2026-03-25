import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ShowChart } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useBenchmarks } from '../context/BenchmarkContext';

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA', '#AF52DE'];

const Analytics = () => {
  const { mode } = useTheme();
  const { benchmarks, fetchBenchmarks } = useBenchmarks();

  useEffect(() => {
    fetchBenchmarks();
  }, [fetchBenchmarks]);

  const trendData = useMemo(() => {
    return benchmarks
      .slice()
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.quarter.localeCompare(b.quarter);
      })
      .map(b => ({
        name: `${b.quarter} ${b.year}`,
        revenue: b.metrics.revenueGrowth,
        efficiency: b.metrics.operationalEfficiency,
        conversion: b.metrics.conversionRate,
        satisfaction: b.metrics.customerSatisfaction,
      }));
  }, [benchmarks]);

  const averages = useMemo(() => {
    if (benchmarks.length === 0) return null;
    const sum = benchmarks.reduce((acc, b) => ({
      websiteTraffic: acc.websiteTraffic + b.metrics.websiteTraffic,
      conversionRate: acc.conversionRate + b.metrics.conversionRate,
      socialMediaEngagement: acc.socialMediaEngagement + b.metrics.socialMediaEngagement,
      customerSatisfaction: acc.customerSatisfaction + b.metrics.customerSatisfaction,
      revenueGrowth: acc.revenueGrowth + b.metrics.revenueGrowth,
      operationalEfficiency: acc.operationalEfficiency + b.metrics.operationalEfficiency,
    }), {
      websiteTraffic: 0,
      conversionRate: 0,
      socialMediaEngagement: 0,
      customerSatisfaction: 0,
      revenueGrowth: 0,
      operationalEfficiency: 0,
    });

    const count = benchmarks.length;
    return Object.fromEntries(
      Object.entries(sum).map(([k, v]) => [k, (v / count).toFixed(2)])
    );
  }, [benchmarks]);

  const pieData = useMemo(() => {
    if (!averages) return [];
    return [
      { name: 'Website Traffic', value: parseFloat(averages.websiteTraffic) },
      { name: 'Conversion Rate', value: parseFloat(averages.conversionRate) },
      { name: 'Social Engagement', value: parseFloat(averages.socialMediaEngagement) },
      { name: 'Customer Satisfaction', value: parseFloat(averages.customerSatisfaction) },
      { name: 'Revenue Growth', value: parseFloat(averages.revenueGrowth) },
      { name: 'Operational Efficiency', value: parseFloat(averages.operationalEfficiency) },
    ];
  }, [averages]);

  const latestBenchmark = benchmarks[0];
  const previousBenchmark = benchmarks[1];

  const getChange = (current, previous, metric) => {
    if (!current || !previous) return null;
    const change = current.metrics[metric] - previous.metrics[metric];
    return {
      value: Math.abs(change).toFixed(2),
      isPositive: change >= 0,
    };
  };

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Comprehensive performance analysis and trends
      </Typography>

      {benchmarks.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShowChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>No Data Available</Typography>
          <Typography variant="body2" color="text.secondary">
            Create benchmarks to view analytics
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2.5} mb={3}>
            {averages && Object.entries(averages).map(([key, value], idx) => {
              const change = getChange(latestBenchmark, previousBenchmark, key);
              return (
                <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
                  <Card>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, my: 1 }}>
                        {value}
                      </Typography>
                      {change && (
                        <Box display="flex" alignItems="center" gap={0.5}>
                          {change.isPositive ? (
                            <TrendingUp sx={{ fontSize: 16, color: '#34C759' }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 16, color: '#FF3B30' }} />
                          )}
                          <Typography variant="caption" color={change.isPositive ? '#34C759' : '#FF3B30'}>
                            {change.value}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Performance Trends
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={mode === 'light' ? '#e0e0e0' : '#333'} />
                    <XAxis dataKey="name" stroke={mode === 'light' ? '#666' : '#999'} />
                    <YAxis stroke={mode === 'light' ? '#666' : '#999'} />
                    <Tooltip contentStyle={{ background: mode === 'light' ? '#fff' : '#1c1c1e', border: 'none', borderRadius: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#007AFF" strokeWidth={2} name="Revenue Growth" />
                    <Line type="monotone" dataKey="efficiency" stroke="#34C759" strokeWidth={2} name="Efficiency" />
                    <Line type="monotone" dataKey="conversion" stroke="#FF9500" strokeWidth={2} name="Conversion" />
                    <Line type="monotone" dataKey="satisfaction" stroke="#FF3B30" strokeWidth={2} name="Satisfaction" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Metrics Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Comparative Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={mode === 'light' ? '#e0e0e0' : '#333'} />
                    <XAxis dataKey="name" stroke={mode === 'light' ? '#666' : '#999'} />
                    <YAxis stroke={mode === 'light' ? '#666' : '#999'} />
                    <Tooltip contentStyle={{ background: mode === 'light' ? '#fff' : '#1c1c1e', border: 'none', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#007AFF" name="Revenue Growth" />
                    <Bar dataKey="efficiency" fill="#34C759" name="Efficiency" />
                    <Bar dataKey="conversion" fill="#FF9500" name="Conversion" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Analytics;
