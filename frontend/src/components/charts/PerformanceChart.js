import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const METRIC_LABELS = [
  { key: 'websiteTraffic', label: 'Traffic' },
  { key: 'conversionRate', label: 'Conversion' },
  { key: 'socialMediaEngagement', label: 'Engagement' },
  { key: 'customerSatisfaction', label: 'Satisfaction' },
  { key: 'revenueGrowth', label: 'Revenue' },
  { key: 'operationalEfficiency', label: 'Efficiency' },
];

const PerformanceChart = ({ userAverages = {}, industryAverages = {} }) => {
  const data = METRIC_LABELS.map((metric) => ({
    name: metric.label,
    user: Number(userAverages[metric.key] || 0),
    industry: Number(industryAverages[metric.key] || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="user" name="Your Average" fill="#2563eb" radius={[6, 6, 0, 0]} />
        <Bar dataKey="industry" name="Industry Avg" fill="#94a3b8" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
