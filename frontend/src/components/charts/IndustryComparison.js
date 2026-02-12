import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const METRIC_LABELS = [
  { key: 'websiteTraffic', label: 'Traffic' },
  { key: 'conversionRate', label: 'Conversion' },
  { key: 'socialMediaEngagement', label: 'Engagement' },
  { key: 'customerSatisfaction', label: 'Satisfaction' },
  { key: 'revenueGrowth', label: 'Revenue' },
  { key: 'operationalEfficiency', label: 'Efficiency' },
];

const IndustryComparison = ({ userAverages = {}, industryAverages = {} }) => {
  const data = METRIC_LABELS.map((metric) => ({
    metric: metric.label,
    user: Number(userAverages[metric.key] || 0),
    industry: Number(industryAverages[metric.key] || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis />
        <Tooltip />
        <Legend />
        <Radar name="Your Average" dataKey="user" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
        <Radar name="Industry Avg" dataKey="industry" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default IndustryComparison;
