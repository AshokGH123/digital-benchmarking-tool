import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, Box, Card, CardContent,
  Chip, IconButton, Tooltip, Skeleton, Fade,
} from '@mui/material';
import {
  TrendingUp, People, AttachMoney, Speed, ThumbUp,
  FileDownload, Refresh, Lightbulb, AutoAwesome, Rocket, Timeline,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { benchmarkService } from '../services/benchmark';
import BenchmarkChart from '../components/charts/BenchmarkChart';
import PerformanceChart from '../components/charts/PerformanceChart';
import toast from 'react-hot-toast';

const MetricSkeleton = () => (
  <Grid container spacing={2.5} mb={3}>
    {[1,2,3,4].map(i => (
      <Grid item xs={12} sm={6} md={3} key={i}>
        <Card><CardContent>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" height={48} />
          <Skeleton variant="text" width="50%" />
        </CardContent></Card>
      </Grid>
    ))}
  </Grid>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { mode } = useTheme();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await benchmarkService.getDashboardData();
      setDashboardData(response.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const metricCards = [
    { title: 'Website Traffic', value: dashboardData?.userAverages?.websiteTraffic || 0, icon: <People />, trend: '+12%', color: mode === 'light' ? '#007AFF' : '#0A84FF' },
    { title: 'Conversion Rate', value: `${dashboardData?.userAverages?.conversionRate || 0}%`, icon: <AttachMoney />, trend: '+5%', color: mode === 'light' ? '#34C759' : '#30D158' },
    { title: 'Social Engagement', value: dashboardData?.userAverages?.socialMediaEngagement || 0, icon: <ThumbUp />, trend: '+18%', color: mode === 'light' ? '#5AC8FA' : '#64D2FF' },
    { title: 'Operational Efficiency', value: `${dashboardData?.userAverages?.operationalEfficiency || 0}%`, icon: <Speed />, trend: '+8%', color: mode === 'light' ? '#FF9500' : '#FF9F0A' },
  ];

  const aiInsights = [
    { text: 'Your conversion rate is 15% above industry average', icon: <Rocket />, color: '#34C759' },
    { text: 'Consider optimizing social media strategy for better reach', icon: <Lightbulb />, color: '#FF9500' },
    { text: 'Website traffic shows consistent growth trend', icon: <Timeline />, color: '#007AFF' },
  ];

  const quickActions = [
    { label: 'Email Report', icon: <FileDownload />, action: async () => {
      const tid = toast.loading('Sending report...');
      try {
        await benchmarkService.sendReport();
        toast.success('Report sent to your email!', { id: tid });
      } catch {
        toast.error('Failed to send report', { id: tid });
      }
    }},
    { label: 'Refresh Data', icon: <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />, action: () => fetchDashboardData(true) },
  ];

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3,
      '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }}>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's your performance overview.
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {quickActions.map((action, idx) => (
            <Tooltip key={idx} title={action.label}>
              <IconButton onClick={action.action} sx={{
                background: mode === 'light' ? 'rgba(0,122,255,0.12)' : 'rgba(10,132,255,0.2)',
                color: mode === 'light' ? '#007AFF' : '#0A84FF',
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'transform 0.2s',
              }}>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Metric Cards */}
      {loading ? <MetricSkeleton /> : (
        <Grid container spacing={2.5} mb={3}>
          {metricCards.map((card, index) => (
            <Fade in timeout={400 + index * 100} key={index}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {card.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>{card.value}</Typography>
                      </Box>
                      <Box sx={{ width: 44, height: 44, borderRadius: '12px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: `${card.color}15`, color: card.color }}>
                        {card.icon}
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <TrendingUp sx={{ color: '#34C759', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#34C759' }}>
                        {card.trend} from last quarter
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Fade>
          ))}
        </Grid>
      )}

      {/* AI Insights */}
      <Fade in={!loading} timeout={600}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <AutoAwesome sx={{ color: mode === 'light' ? '#007AFF' : '#0A84FF' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Insights</Typography>
          </Box>
          <Grid container spacing={2}>
            {aiInsights.map((insight, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px',
                  background: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'transform 0.2s', '&:hover': { transform: 'translateX(4px)' } }}>
                  <Box sx={{ color: insight.color, fontSize: 28 }}>{insight.icon}</Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{insight.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Fade>

      {/* Charts */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Performance Trends</Typography>
            {loading
              ? <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              : <BenchmarkChart data={dashboardData?.metricsTrend || []} />
            }
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Industry Comparison</Typography>
            {loading
              ? <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              : <PerformanceChart userAverages={dashboardData?.userAverages} industryAverages={dashboardData?.industryAverages} />
            }
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Benchmarks */}
      {!loading && dashboardData?.latestBenchmark && (
        <Fade in timeout={800}>
          <Paper sx={{ p: 3, mt: 2.5 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Recent Benchmark</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {dashboardData.latestBenchmark.quarter} {dashboardData.latestBenchmark.year}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {Object.entries(dashboardData.latestBenchmark.metrics).map(([key, value]) => (
                <Chip key={key} label={`${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`} sx={{ fontWeight: 600 }} />
              ))}
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Dashboard;
