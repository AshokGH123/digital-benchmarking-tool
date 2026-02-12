const mongoose = require('mongoose');
const Benchmark = require('../models/Benchmark');
const Industry = require('../models/Industry');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's benchmarks
    const userBenchmarks = await Benchmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get latest benchmark
    const latestBenchmark = userBenchmarks[0];

    // Calculate user averages
    const userAverages = calculateUserAverages(userBenchmarks);

    // Get industry averages
    const industry = req.user.industry || 'Technology';
    const industryData = await Industry.findOne({ name: industry });

    // Get quarterly data
    const quarterlyData = await getQuarterlyData(userId);

    // Get metrics trend
    const metricsTrend = await getMetricsTrend(userId);

    res.json({
      success: true,
      data: {
        userAverages,
        industryAverages: industryData?.averageMetrics || {},
        latestBenchmark: latestBenchmark || null,
        quarterlyData,
        metricsTrend,
        totalBenchmarks: userBenchmarks.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
const calculateUserAverages = (benchmarks) => {
  if (benchmarks.length === 0) {
    return {
      websiteTraffic: 0,
      conversionRate: 0,
      socialMediaEngagement: 0,
      customerSatisfaction: 0,
      revenueGrowth: 0,
      operationalEfficiency: 0,
    };
  }

  const averages = {
    websiteTraffic: 0,
    conversionRate: 0,
    socialMediaEngagement: 0,
    customerSatisfaction: 0,
    revenueGrowth: 0,
    operationalEfficiency: 0,
  };

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

const getQuarterlyData = async (userId) => {
  const currentYear = new Date().getFullYear();
  
  const quarters = await Benchmark.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        year: currentYear,
      },
    },
    {
      $group: {
        _id: '$quarter',
        avgWebsiteTraffic: { $avg: '$metrics.websiteTraffic' },
        avgConversionRate: { $avg: '$metrics.conversionRate' },
        avgSocialMediaEngagement: { $avg: '$metrics.socialMediaEngagement' },
        avgCustomerSatisfaction: { $avg: '$metrics.customerSatisfaction' },
        avgRevenueGrowth: { $avg: '$metrics.revenueGrowth' },
        avgOperationalEfficiency: { $avg: '$metrics.operationalEfficiency' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return quarters;
};

const getMetricsTrend = async (userId) => {
  const benchmarks = await Benchmark.find({ user: userId })
    .sort({ createdAt: 1 })
    .limit(12);

  return benchmarks.map(benchmark => ({
    date: benchmark.createdAt,
    metrics: benchmark.metrics,
    quarter: `${benchmark.quarter} ${benchmark.year}`,
  }));
};
