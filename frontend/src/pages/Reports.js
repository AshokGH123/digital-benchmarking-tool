import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import toast from 'react-hot-toast';
import { useBenchmarks } from '../context/BenchmarkContext';

const Reports = () => {
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
        toast.error(error?.message || 'Failed to load benchmarks');
      });
  }, [globalBenchmarks, fetchBenchmarks]);

  const groupByQuarter = () => {
    const groups = {};
    benchmarks.forEach((b) => {
      const key = `${b.quarter}-${b.year}`;
      if (!groups[key]) {
        groups[key] = {
          quarter: b.quarter,
          year: b.year,
          count: 0,
          totals: {
            websiteTraffic: 0,
            conversionRate: 0,
            socialMediaEngagement: 0,
            customerSatisfaction: 0,
            revenueGrowth: 0,
            operationalEfficiency: 0,
          },
        };
      }
      groups[key].count += 1;
      Object.keys(groups[key].totals).forEach((k) => {
        groups[key].totals[k] += Number(b.metrics[k] || 0);
      });
    });

    return Object.values(groups).map((g) => ({
      quarter: g.quarter,
      year: g.year,
      count: g.count,
      ...Object.fromEntries(
        Object.entries(g.totals).map(([k, v]) => [k, Number((v / g.count).toFixed(2))])
      ),
    }));
  };

  const downloadCsv = (rows, filename) => {
    const header = Object.keys(rows[0] || {}).join(',');
    const body = rows.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header, ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    const summary = groupByQuarter();
    if (summary.length === 0) {
      toast.error('No benchmarks to generate report');
      return;
    }
    downloadCsv(summary, 'quarterly-summary.csv');
  };

  const handleExportKpis = () => {
    if (benchmarks.length === 0) {
      toast.error('No benchmarks to export');
      return;
    }
    const rows = benchmarks.map((b) => ({
      id: b.id,
      industry: b.industry,
      quarter: b.quarter,
      year: b.year,
      websiteTraffic: b.metrics.websiteTraffic,
      conversionRate: b.metrics.conversionRate,
      socialMediaEngagement: b.metrics.socialMediaEngagement,
      customerSatisfaction: b.metrics.customerSatisfaction,
      revenueGrowth: b.metrics.revenueGrowth,
      operationalEfficiency: b.metrics.operationalEfficiency,
      createdAt: b.createdAt,
    }));
    downloadCsv(rows, 'kpi-export.csv');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Generate and export performance reports for stakeholders.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quarterly Summary
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Summarize benchmarks by quarter and compare against industry averages.
            </Typography>
            <Button variant="contained" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              KPI Export
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Export key performance indicators as CSV for deeper analysis.
            </Typography>
            <Button variant="outlined" onClick={handleExportKpis}>
              Export CSV
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
