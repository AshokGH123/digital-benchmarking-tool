import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  AutoAwesome,
  TrendingUp,
  CheckCircle,
  Warning,
  Error,
  Lightbulb,
  Speed,
  AttachMoney,
  People,
  BugReport,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { generateRecommendations } from '../utils/aiRecommendations';

const AIInsights = () => {
  const { mode } = useTheme();
  const [processData, setProcessData] = useState({
    time: '',
    cost: '',
    resources: '',
    errorRate: '',
  });
  const [benchmarkData] = useState({
    time: 6,
    cost: 5000,
    resources: 8,
    errorRate: 2,
  });
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (e) => {
    setProcessData({ ...processData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const result = generateRecommendations(
        {
          time: parseFloat(processData.time) || 0,
          cost: parseFloat(processData.cost) || 0,
          resources: parseFloat(processData.resources) || 0,
          errorRate: parseFloat(processData.errorRate) || 0,
        },
        benchmarkData
      );
      setAnalysis(result);
      setAnalyzing(false);
    }, 1500);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#007AFF';
      case 'success': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error />;
      case 'medium': return <Warning />;
      case 'low': return <TrendingUp />;
      case 'success': return <CheckCircle />;
      default: return <Lightbulb />;
    }
  };

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <AutoAwesome sx={{ color: mode === 'light' ? '#007AFF' : '#0A84FF' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          AI Process Insights
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Get intelligent recommendations to optimize your processes
      </Typography>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Enter Process Data
            </Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
              Input your current process metrics for analysis
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Process Time (hours)"
                  name="time"
                  value={processData.time}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <Speed sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Process Cost ($)"
                  name="cost"
                  value={processData.cost}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Resources Used"
                  name="resources"
                  value={processData.resources}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <People sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Error Rate (%)"
                  name="errorRate"
                  value={processData.errorRate}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <BugReport sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
              Benchmark Values
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Time:</Typography>
                <Typography variant="body2" fontWeight={600}>{benchmarkData.time} hrs</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Cost:</Typography>
                <Typography variant="body2" fontWeight={600}>${benchmarkData.cost}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Resources:</Typography>
                <Typography variant="body2" fontWeight={600}>{benchmarkData.resources}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Error Rate:</Typography>
                <Typography variant="body2" fontWeight={600}>{benchmarkData.errorRate}%</Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleAnalyze}
              disabled={analyzing || !processData.time}
              sx={{ mt: 3, textTransform: 'none', fontWeight: 600 }}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Process'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={8}>
          {analyzing && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Analyzing your process...</Typography>
              <LinearProgress />
            </Paper>
          )}

          {!analyzing && analysis && (
            <>
              <Card sx={{ mb: 2.5, background: mode === 'light' ? 'linear-gradient(135deg, #007AFF15 0%, #5AC8FA15 100%)' : 'linear-gradient(135deg, #0A84FF20 0%, #64D2FF20 100%)' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Overall Efficiency Score
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on comparison with industry benchmarks
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h2" sx={{ fontWeight: 700, color: mode === 'light' ? '#007AFF' : '#0A84FF' }}>
                        {analysis.overallScore}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {analysis.overallScore >= 80 ? 'Excellent' : analysis.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {analysis.priorityActions.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2.5 }}>
                  <AlertTitle sx={{ fontWeight: 700 }}>Priority Actions</AlertTitle>
                  <List dense>
                    {analysis.priorityActions.map((action, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={action} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                AI Recommendations
              </Typography>

              <Grid container spacing={2.5}>
                {analysis.recommendations.map((rec, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `${getSeverityColor(rec.severity)}15`,
                              color: getSeverityColor(rec.severity),
                            }}
                          >
                            {getSeverityIcon(rec.severity)}
                          </Box>
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {rec.category}
                              </Typography>
                              <Chip
                                label={rec.severity.toUpperCase()}
                                size="small"
                                sx={{
                                  background: `${getSeverityColor(rec.severity)}20`,
                                  color: getSeverityColor(rec.severity),
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {rec.issue}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                              Suggested Actions:
                            </Typography>
                            <List dense>
                              {rec.suggestions.map((suggestion, sIdx) => (
                                <ListItem key={sIdx} sx={{ pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <Lightbulb fontSize="small" sx={{ color: mode === 'light' ? '#007AFF' : '#0A84FF' }} />
                                  </ListItemIcon>
                                  <ListItemText primary={suggestion} />
                                </ListItem>
                              ))}
                            </List>
                            <Alert severity="info" sx={{ mt: 2 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {rec.impact}
                              </Typography>
                            </Alert>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {!analyzing && !analysis && (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Ready to Analyze</Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your process data and click "Analyze Process" to get AI-powered recommendations
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIInsights;
