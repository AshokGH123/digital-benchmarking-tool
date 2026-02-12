const Benchmark = require('../models/Benchmark');
const Industry = require('../models/Industry');
const { calculateIndustryAverages, formatBenchmarkData } = require('../utils/helpers');

// @desc    Create benchmark
// @route   POST /api/benchmarks
// @access  Private
exports.createBenchmark = async (req, res, next) => {
  try {
    const { metrics, industry, quarter, year, notes } = req.body;

    const benchmark = await Benchmark.create({
      user: req.user.id,
      metrics,
      industry,
      quarter,
      year,
      notes,
    });

    // Update industry averages
    await updateIndustryAverages(industry);

    res.status(201).json({
      success: true,
      data: formatBenchmarkData(benchmark),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all benchmarks for user
// @route   GET /api/benchmarks
// @access  Private
exports.getBenchmarks = async (req, res, next) => {
  try {
    const benchmarks = await Benchmark.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: benchmarks.length,
      data: benchmarks.map(formatBenchmarkData),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single benchmark
// @route   GET /api/benchmarks/:id
// @access  Private
exports.getBenchmark = async (req, res, next) => {
  try {
    const benchmark = await Benchmark.findById(req.params.id);

    if (!benchmark) {
      return res.status(404).json({
        success: false,
        error: 'Benchmark not found',
      });
    }

    // Make sure user owns benchmark
    if (benchmark.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: formatBenchmarkData(benchmark),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update benchmark
// @route   PUT /api/benchmarks/:id
// @access  Private
exports.updateBenchmark = async (req, res, next) => {
  try {
    let benchmark = await Benchmark.findById(req.params.id);

    if (!benchmark) {
      return res.status(404).json({
        success: false,
        error: 'Benchmark not found',
      });
    }

    // Make sure user owns benchmark
    if (benchmark.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    benchmark = await Benchmark.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Update industry averages
    await updateIndustryAverages(benchmark.industry);

    res.json({
      success: true,
      data: formatBenchmarkData(benchmark),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete benchmark
// @route   DELETE /api/benchmarks/:id
// @access  Private
exports.deleteBenchmark = async (req, res, next) => {
  try {
    const benchmark = await Benchmark.findById(req.params.id);

    if (!benchmark) {
      return res.status(404).json({
        success: false,
        error: 'Benchmark not found',
      });
    }

    // Make sure user owns benchmark
    if (benchmark.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await benchmark.deleteOne();

    // Update industry averages
    await updateIndustryAverages(benchmark.industry);

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get industry benchmarks
// @route   GET /api/benchmarks/industry/:industry
// @access  Private
exports.getIndustryBenchmarks = async (req, res, next) => {
  try {
    const { industry } = req.params;
    const { quarter, year } = req.query;

    let query = { industry };
    
    if (quarter) query.quarter = quarter;
    if (year) query.year = year;

    const benchmarks = await Benchmark.find(query);

    const averages = await calculateIndustryAverages(benchmarks);

    res.json({
      success: true,
      data: {
        industry,
        averages,
        benchmarks: benchmarks.map(formatBenchmarkData),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update industry averages
const updateIndustryAverages = async (industryName) => {
  try {
    const benchmarks = await Benchmark.find({ industry: industryName });
    const averages = await calculateIndustryAverages(benchmarks);

    await Industry.findOneAndUpdate(
      { name: industryName },
      {
        name: industryName,
        averageMetrics: averages,
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating industry averages:', error);
  }
};