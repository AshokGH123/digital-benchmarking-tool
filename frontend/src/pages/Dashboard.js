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
  IconButton,
  Tooltip,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  Speed,
  ThumbUp,
  FileDownload,
  Refresh,
  Lightbulb,
  AutoAwesome,
  Rocket,
  Timeline,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { benchmarkService } from '../services/benchmark';
import BenchmarkChart from '../components/charts/BenchmarkChart';
import PerformanceChart from '../components/charts/PerformanceChart';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();

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
      <TrendingUp sx={{ color: '#34C759' }} />
    ) : (
      <TrendingDown sx={{ color: '#FF3B30' }} />
    );
  };

  const metricCards = [
    {
      title: 'Website Traffic',
      value: dashboardData?.userAverages?.websiteTraffic || 0,
      icon: <People />,
      trend: '+12%',
      color: mode === 'light' ? '#007AFF' : '#0A84FF',
    },
    {
      title: 'Conversion Rate',
      value: dashboardData?.userAverages?.conversionRate || 0,
      icon: <AttachMoney />,
      trend: '+5%',
      color: mode === 'light' ? '#34C759' : '#30D158',
    },
    {
      title: 'Social Engagement',
      value: dashboardData?.userAverages?.socialMediaEngagement || 0,
      icon: <ThumbUp />,
      trend: '+18%',
      color: mode === 'light' ? '#5AC8FA' : '#64D2FF',
    },
    {
      title: 'Operational Efficiency',
      value: dashboardData?.userAverages?.operationalEfficiency || 0,
      icon: <Speed />,
      trend: '+8%',
      color: mode === 'light' ? '#FF9500' : '#FF9F0A',
    },
  ];

  const aiInsights = [
    { text: 'Your conversion rate is 15% above industry average', icon: <Rocket />, color: '#34C759' },
    { text: 'Consider optimizing social media strategy', icon: <Lightbulb />, color: '#FF9500' },
    { text: 'Website traffic shows consistent growth', icon: <Timeline />, color: '#007AFF' },
  ];

  const quickActions = [
    { label: 'New Benchmark', icon: <AutoAwesome />, action: () => toast.success('Navigate to Benchmark') },
    { label: 'Export Report', icon: <FileDownload />, action: () => toast.success('Exporting...') },
    { label: 'Refresh Data', icon: <Refresh />, action: fetchDashboardData },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: mode === 'light' 
        ? '#F2F2F7' 
        : '#000000',
      minHeight: '100vh',
      p: 3,
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's your performance overview.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {quickActions.map((action, idx) => (
            <Tooltip key={idx} title={action.label}>
              <IconButton 
                onClick={action.action}
                sx={{ 
                  background: mode === 'light'
                    ? 'rgba(0, 122, 255, 0.12)'
                    : 'rgba(10, 132, 255, 0.2)',
                  color: mode === 'light' ? '#007AFF' : '#0A84FF',
                  '&:hover': { 
                    transform: 'scale(1.1)',
                    background: mode === 'light'
                      ? 'rgba(0, 122, 255, 0.18)'
                      : 'rgba(10, 132, 255, 0.3)',
                  }
                }}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Grid container spacing={2.5} mb={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `${card.color}15`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getTrendIcon(1)}
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {card.trend} from last quarter
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <AutoAwesome sx={{ color: mode === 'light' ? '#007AFF' : '#0A84FF' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            AI Insights
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {aiInsights.map((insight, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: '14px',
                  background: mode === 'light'
                    ? 'rgba(0, 0, 0, 0.02)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: mode === 'light'
                    ? '1px solid rgba(0, 0, 0, 0.06)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box sx={{ color: insight.color, fontSize: 28 }}>
                  {insight.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {insight.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Performance Trends
            </Typography>
            <BenchmarkChart data={dashboardData?.metricsTrend || []} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Industry Comparison
            </Typography>
            <PerformanceChart
              userAverages={dashboardData?.userAverages}
              industryAverages={dashboardData?.industryAverages}
            />
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 2.5 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Recent Benchmarks
        </Typography>
        {dashboardData?.latestBenchmark && (
          <Box>
            <Typography variant="body2" paragraph color="text.secondary">
              Latest: {dashboardData.latestBenchmark.quarter} {dashboardData.latestBenchmark.year}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {Object.entries(dashboardData.latestBenchmark.metrics).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  sx={{ fontWeight: 600 }}
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
