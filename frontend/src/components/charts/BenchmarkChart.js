import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const BenchmarkChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.quarter,
    websiteTraffic: item.metrics.websiteTraffic,
    conversionRate: item.metrics.conversionRate,
    socialMediaEngagement: item.metrics.socialMediaEngagement,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="websiteTraffic"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="conversionRate"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="socialMediaEngagement"
          stroke="#ffc658"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BenchmarkChart;