import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  Speed,
  ThumbUp,
} from '@mui/icons-material';
import { benchmarkService } from '../services/benchmark';
import BenchmarkChart from '../components/charts/BenchmarkChart';
import PerformanceChart from '../components/charts/PerformanceChart';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await benchmarkService.getDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Failed to load dashboard data';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value) => {
    return value > 0 ? (
      <TrendingUp color="success" />
    ) : (
      <TrendingDown color="error" />
    );
  };

  const metricCards = [
    {
      title: 'Website Traffic',
      value: dashboardData?.userAverages?.websiteTraffic || 0,
      icon: <People />,
      trend: '+12%',
      color: 'primary',
    },
    {
      title: 'Conversion Rate',
      value: dashboardData?.userAverages?.conversionRate || 0,
      icon: <AttachMoney />,
      trend: '+5%',
      color: 'success',
    },
    {
      title: 'Social Engagement',
      value: dashboardData?.userAverages?.socialMediaEngagement || 0,
      icon: <ThumbUp />,
      trend: '+18%',
      color: 'info',
    },
    {
      title: 'Operational Efficiency',
      value: dashboardData?.userAverages?.operationalEfficiency || 0,
      icon: <Speed />,
      trend: '+8%',
      color: 'warning',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Welcome back! Here's what's happening with your benchmarks.
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: `${card.color}.main` }}>
                    {card.icon}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {getTrendIcon(1)}
                  <Typography variant="body2" color="textSecondary">
                    {card.trend} from last quarter
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Benchmark Performance
            </Typography>
            <BenchmarkChart data={dashboardData?.metricsTrend || []} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Industry Comparison
            </Typography>
            <PerformanceChart
              userAverages={dashboardData?.userAverages}
              industryAverages={dashboardData?.industryAverages}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Benchmarks */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Benchmarks
        </Typography>
        {dashboardData?.latestBenchmark && (
          <Box>
            <Typography variant="body1" paragraph>
              Latest benchmark from {dashboardData.latestBenchmark.quarter} {dashboardData.latestBenchmark.year}
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {Object.entries(dashboardData.latestBenchmark.metrics).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
