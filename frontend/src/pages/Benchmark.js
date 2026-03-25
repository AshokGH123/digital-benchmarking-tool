import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button, Card, CardContent,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Stack,
  InputAdornment, Skeleton, Pagination, Fade, Tooltip, CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, Assessment, Search, FilterList, Clear } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { useBenchmarks } from '../context/BenchmarkContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const YEARS = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
const ITEMS_PER_PAGE = 6;

const emptyMetrics = {
  websiteTraffic: '', conversionRate: '', socialMediaEngagement: '',
  customerSatisfaction: '', revenueGrowth: '', operationalEfficiency: '',
};

const BenchmarkSkeleton = () => (
  <Grid container spacing={2.5}>
    {[1, 2, 3].map(i => (
      <Grid item xs={12} md={6} lg={4} key={i}>
        <Card><CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" />
          <Box mt={2}>{[1,2,3,4,5,6].map(j => <Skeleton key={j} variant="text" />)}</Box>
        </CardContent></Card>
      </Grid>
    ))}
  </Grid>
);

const Benchmark = () => {
  const { mode } = useTheme();
  const { user } = useAuth();
  const { benchmarks, loading, fetchBenchmarks, createBenchmark, updateBenchmark, deleteBenchmark } = useBenchmarks();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterQuarter, setFilterQuarter] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    industry: user?.industry || '', quarter: 'Q1',
    year: new Date().getFullYear(), notes: '', metrics: { ...emptyMetrics },
  });

  useEffect(() => { fetchBenchmarks(); }, [fetchBenchmarks]);

  const filtered = benchmarks.filter(b => {
    const matchSearch = !search ||
      b.industry.toLowerCase().includes(search.toLowerCase()) ||
      (b.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchQuarter = !filterQuarter || b.quarter === filterQuarter;
    const matchYear = !filterYear || String(b.year) === String(filterYear);
    return matchSearch && matchQuarter && matchYear;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = () => { setSearch(''); setFilterQuarter(''); setFilterYear(''); setPage(1); };

  const handleOpen = (benchmark = null) => {
    if (benchmark) {
      setEditingId(benchmark.id);
      setFormData({ industry: benchmark.industry, quarter: benchmark.quarter, year: benchmark.year, notes: benchmark.notes || '', metrics: benchmark.metrics });
    } else {
      setEditingId(null);
      setFormData({ industry: user?.industry || '', quarter: 'Q1', year: new Date().getFullYear(), notes: '', metrics: { ...emptyMetrics } });
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metrics.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, metrics: { ...prev.metrics, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      year: Number(formData.year),
      metrics: Object.fromEntries(Object.entries(formData.metrics).map(([k, v]) => [k, Number(v) || 0])),
    };
    try {
      if (editingId) {
        await updateBenchmark(editingId, payload);
        toast.success('Benchmark updated!');
      } else {
        await createBenchmark(payload);
        toast.success('Benchmark created!');
      }
      setOpen(false);
      setEditingId(null);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this benchmark?')) {
      await deleteBenchmark(id);
      toast.success('Benchmark deleted');
    }
  };

  const hasFilters = search || filterQuarter || filterYear;

  return (
    <Box sx={{ background: mode === 'light' ? '#F2F2F7' : '#000000', minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Benchmarks</Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} of {benchmarks.length} records
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}
          sx={{ textTransform: 'none', fontWeight: 600 }}>
          New Benchmark
        </Button>
      </Box>

      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField fullWidth size="small" placeholder="Search by industry or notes..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}><Clear fontSize="small" /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={2.5}>
            <TextField fullWidth select size="small" label="Quarter" value={filterQuarter}
              onChange={e => { setFilterQuarter(e.target.value); setPage(1); }}>
              <MenuItem value="">All Quarters</MenuItem>
              {QUARTERS.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2.5}>
            <TextField fullWidth select size="small" label="Year" value={filterYear}
              onChange={e => { setFilterYear(e.target.value); setPage(1); }}>
              <MenuItem value="">All Years</MenuItem>
              {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            {hasFilters && (
              <Button fullWidth variant="outlined" size="small" startIcon={<Clear />} onClick={clearFilters}
                sx={{ textTransform: 'none' }}>
                Clear Filters
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {loading ? <BenchmarkSkeleton /> : (
        <>
          <Grid container spacing={2.5}>
            {paginated.map((benchmark, idx) => (
              <Fade in key={benchmark.id} timeout={300 + idx * 100}>
                <Grid item xs={12} md={6} lg={4}>
                  <Card sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {benchmark.quarter} {benchmark.year}
                          </Typography>
                          <Chip label={benchmark.industry} size="small" sx={{ mt: 0.5 }} />
                        </Box>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpen(benchmark)}><Edit fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDelete(benchmark.id)}><Delete fontSize="small" /></IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Stack spacing={1}>
                        {[
                          ['Website Traffic', benchmark.metrics.websiteTraffic, ''],
                          ['Conversion Rate', benchmark.metrics.conversionRate, '%'],
                          ['Social Engagement', benchmark.metrics.socialMediaEngagement, ''],
                          ['Customer Satisfaction', benchmark.metrics.customerSatisfaction, '%'],
                          ['Revenue Growth', benchmark.metrics.revenueGrowth, '%'],
                          ['Operational Efficiency', benchmark.metrics.operationalEfficiency, '%'],
                        ].map(([label, value, unit]) => (
                          <Box key={label} display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                            <Typography variant="body2" fontWeight={600}>{value}{unit}</Typography>
                          </Box>
                        ))}
                      </Stack>
                      {benchmark.notes && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          📝 {benchmark.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Fade>
            ))}

            {filtered.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {hasFilters ? 'No results found' : 'No Benchmarks Yet'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    {hasFilters ? 'Try adjusting your search or filters' : 'Create your first benchmark to start tracking'}
                  </Typography>
                  {hasFilters
                    ? <Button variant="outlined" onClick={clearFilters}>Clear Filters</Button>
                    : <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Create Benchmark</Button>
                  }
                </Paper>
              </Grid>
            )}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)}
                color="primary" shape="rounded" />
            </Box>
          )}
        </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => !submitting && setOpen(false)} maxWidth="md" fullWidth
        TransitionProps={{ timeout: 300 }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Benchmark' : 'New Benchmark'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Industry" name="industry" value={formData.industry} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label="Quarter" name="quarter" value={formData.quarter} onChange={handleChange} required>
                  {QUARTERS.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label="Year" name="year" value={formData.year} onChange={handleChange} required>
                  {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </TextField>
              </Grid>
              {[
                ['Website Traffic', 'websiteTraffic', null],
                ['Conversion Rate (%)', 'conversionRate', 100],
                ['Social Media Engagement', 'socialMediaEngagement', null],
                ['Customer Satisfaction (%)', 'customerSatisfaction', 100],
                ['Revenue Growth (%)', 'revenueGrowth', null],
                ['Operational Efficiency (%)', 'operationalEfficiency', 100],
              ].map(([label, key, max]) => (
                <Grid item xs={12} md={6} key={key}>
                  <TextField fullWidth type="number" label={label}
                    name={`metrics.${key}`} value={formData.metrics[key]} onChange={handleChange}
                    inputProps={{ min: 0, ...(max ? { max } : {}) }} required />
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Notes" name="notes" value={formData.notes} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}
              startIcon={submitting && <CircularProgress size={16} color="inherit" />}
              sx={{ textTransform: 'none', minWidth: 100 }}>
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Benchmark;
