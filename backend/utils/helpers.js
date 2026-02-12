const generateToken = (user) => {
  const jwt = require('jsonwebtoken');
  const { secret, expiresIn } = require('../config/jwt');
  
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
};

const calculateIndustryAverages = async (benchmarks) => {
  const averages = {
    websiteTraffic: 0,
    conversionRate: 0,
    socialMediaEngagement: 0,
    customerSatisfaction: 0,
    revenueGrowth: 0,
    operationalEfficiency: 0,
  };

  if (benchmarks.length === 0) return averages;

  benchmarks.forEach(benchmark => {
    averages.websiteTraffic += benchmark.metrics.websiteTraffic;
    averages.conversionRate += benchmark.metrics.conversionRate;
    averages.socialMediaEngagement += benchmark.metrics.socialMediaEngagement;
    averages.customerSatisfaction += benchmark.metrics.customerSatisfaction;
    averages.revenueGrowth += benchmark.metrics.revenueGrowth;
    averages.operationalEfficiency += benchmark.metrics.operationalEfficiency;
  });

  const count = benchmarks.length;
  Object.keys(averages).forEach(key => {
    averages[key] = parseFloat((averages[key] / count).toFixed(2));
  });

  return averages;
};

const formatBenchmarkData = (benchmark) => {
  return {
    id: benchmark._id,
    user: benchmark.user,
    metrics: benchmark.metrics,
    industry: benchmark.industry,
    date: benchmark.date,
    quarter: benchmark.quarter,
    year: benchmark.year,
    notes: benchmark.notes,
    createdAt: benchmark.createdAt,
  };
};

module.exports = {
  generateToken,
  calculateIndustryAverages,
  formatBenchmarkData,
};