import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { FileDownload, TableChart, Description } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useBenchmarks } from '../context/BenchmarkContext';
import { benchmarkService } from '../services/benchmark';
import toast from 'react-hot-toast';

const Reports = () => {
  const { mode } = useTheme();
  const { benchmarks, fetchBenchmarks } = useBenchmarks();
  const [filterYear, setFilterYear] = useState('all');
  const [filterQuarter, setFilterQuarter] = useState('all');

  useEffect(() => {
    fetchBenchmarks();
  }, [fetchBenchmarks]);

  const filteredBenchmarks = benchmarks.filter(b => {
    if (filterYear !== 'all' && b.year !== parseInt(filterYear)) return false;
    if (filterQuarter !== 'all' && b.quarter !== filterQuarter) return false;
    return true;
  });

  const years = [...new Set(benchmarks.map(b => b.year))].sort((a, b) => b - a);
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const chartData = useMemo(() => {
    return filteredBenchmarks.map(b => ({
      name: `${b.quarter} ${b.year}`,
      conversion: b.metrics.conversionRate,
      satisfaction: b.metrics.customerSatisfaction,
      efficiency: b.metrics.operationalEfficiency,
      revenue: b.metrics.revenueGrowth,
    }));
  }, [filteredBenchmarks]);

  const exportToCSV = () => {
    const headers = ['Quarter', 'Year', 'Industry', 'Website Traffic', 'Conversion Rate', 'Social Engagement', 'Customer Satisfaction', 'Revenue Growth', 'Operational Efficiency', 'Notes'];
    const rows = filteredBenchmarks.map(b => [
      b.quarter,
      b.year,
      b.industry,
      b.metrics.websiteTraffic,
      b.metrics.conversionRate,
      b.metrics.socialMediaEngagement,
      b.metrics.customerSatisfaction,
      b.metrics.revenueGrowth,
      b.metrics.operationalEfficiency,
      b.notes || '',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmarks-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToJSON = () => {
    const data = JSON.stringify(filteredBenchmarks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmarks-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const sendEmailReport = async () => {
    try {
      await benchmarkService.sendReport();
      toast.success('Report sent to your email!');
    } catch (error) {
      toast.error(error.message || 'Failed to send email');
    }
  };

  const summary = filteredBenchmarks.reduce((acc, b) => ({
    count: acc.count + 1,
    totalTraffic: acc.totalTraffic + b.metrics.websiteTraffic,
    avgConversion: acc.avgConversion + b.metrics.conversionRate,
    avgSatisfaction: acc.avgSatisfaction + b.metrics.customerSatisfaction,
    avgRevenue: acc.avgRevenue + b.metrics.revenueGrowth,
  }), { count: 0, totalTraffic: 0, avgConversion: 0, avgSatisfaction: 0, avgRevenue: 0 });

  if (summary.count > 0) {
    summary.avgConversion = (summary.avgConversion / summary.count).toFixed(2);
    summary.avgSatisfaction = (summary.avgSatisfaction / summary.count).toFixed(2);
    summary.avgRevenue = (summary.avgRevenue / summary.count).toFixed(2);
  }

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and export comprehensive reports
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={exportToCSV}
            disabled={filteredBenchmarks.length === 0}
            sx={{ textTransform: 'none' }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Description />}
            onClick={exportToJSON}
            disabled={filteredBenchmarks.length === 0}
            sx={{ textTransform: 'none' }}
          >
            Export JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={sendEmailReport}
            disabled={filteredBenchmarks.length === 0}
            sx={{ textTransform: 'none' }}
          >
            Email Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total Benchmarks</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{summary.count}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Avg Conversion Rate</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{summary.avgConversion}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Avg Satisfaction</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{summary.avgSatisfaction}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Avg Revenue Growth</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{summary.avgRevenue}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {filteredBenchmarks.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Benchmark Comparison Chart
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={mode === 'light' ? '#e0e0e0' : '#333'} />
              <XAxis dataKey="name" stroke={mode === 'light' ? '#666' : '#999'} />
              <YAxis stroke={mode === 'light' ? '#666' : '#999'} />
              <Tooltip contentStyle={{ background: mode === 'light' ? '#fff' : '#1c1c1e', border: 'none', borderRadius: '12px' }} />
              <Legend />
              <Bar dataKey="conversion" fill="#007AFF" name="Conversion Rate" />
              <Bar dataKey="satisfaction" fill="#34C759" name="Customer Satisfaction" />
              <Bar dataKey="efficiency" fill="#FF9500" name="Operational Efficiency" />
              <Bar dataKey="revenue" fill="#FF3B30" name="Revenue Growth" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Year"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <MenuItem value="all">All Years</MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Quarter"
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
            >
              <MenuItem value="all">All Quarters</MenuItem>
              {quarters.map(q => (
                <MenuItem key={q} value={q}>{q}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Benchmark Data
        </Typography>
        {filteredBenchmarks.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>No Data Available</Typography>
            <Typography variant="body2" color="text.secondary">
              Create benchmarks or adjust filters
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Industry</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Traffic</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Conversion</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Engagement</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Satisfaction</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Revenue</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Efficiency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBenchmarks.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell>{b.quarter} {b.year}</TableCell>
                    <TableCell>{b.industry}</TableCell>
                    <TableCell align="right">{b.metrics.websiteTraffic}</TableCell>
                    <TableCell align="right">{b.metrics.conversionRate}%</TableCell>
                    <TableCell align="right">{b.metrics.socialMediaEngagement}</TableCell>
                    <TableCell align="right">{b.metrics.customerSatisfaction}%</TableCell>
                    <TableCell align="right">{b.metrics.revenueGrowth}%</TableCell>
                    <TableCell align="right">{b.metrics.operationalEfficiency}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Reports;
