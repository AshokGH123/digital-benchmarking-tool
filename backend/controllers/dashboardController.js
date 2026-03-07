const Benchmark = require('../models/Benchmark');
const { calculateIndustryAverages } = require('../utils/helpers');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userIndustry = req.user.industry;

    // Get user's benchmarks
    const userBenchmarks = await Benchmark.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get latest benchmark
    const latestBenchmark = userBenchmarks[0];

    // Calculate user averages
    const userAverages = await calculateIndustryAverages(userBenchmarks);

    // Get industry benchmarks
    const industryBenchmarks = await Benchmark.find({ industry: userIndustry });
    const industryAverages = await calculateIndustryAverages(industryBenchmarks);

    // Get metrics trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const metricsTrend = await Benchmark.find({
      user: userId,
      createdAt: { $gte: sixMonthsAgo },
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        userAverages,
        industryAverages,
        latestBenchmark,
        metricsTrend,
        totalBenchmarks: userBenchmarks.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/dashboard/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = { user: userId };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const benchmarks = await Benchmark.find(query).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: benchmarks,
    });
  } catch (error) {
    next(error);
  }
};
