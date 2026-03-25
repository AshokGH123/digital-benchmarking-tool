const nodemailer = require('nodemailer');
const Benchmark = require('../models/Benchmark');
const Industry = require('../models/Industry');
const User = require('../models/User');
const { calculateIndustryAverages, formatBenchmarkData } = require('../utils/helpers');
const { sendBenchmarkReport, sendEmail } = require('../utils/emailService');

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

    await updateIndustryAverages(industry);

    const user = await User.findById(req.user.id);
    if (user.email && process.env.SMTP_USER) {
      try {
        const processData = {
          processName: `${industry} - ${quarter} ${year}`,
          benchmarkTime: 6,
          benchmarkCost: 5000,
          actualTime: 8,
          actualCost: 6000,
          errorRate: 100 - metrics.operationalEfficiency,
          healthScore: Math.round((metrics.conversionRate + metrics.customerSatisfaction + metrics.operationalEfficiency) / 3),
          status: 'Good',
          alerts: [],
        };
        await sendBenchmarkReport(processData, user);
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      data: formatBenchmarkData(benchmark),
    });
  } catch (error) {
    next(error);
  }
};

exports.getBenchmarks = async (req, res, next) => {
  try {
    const { search, quarter, year, industry, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { user: req.user.id };

    if (quarter) query.quarter = quarter;
    if (year) query.year = Number(year);
    if (industry) query.industry = { $regex: industry, $options: 'i' };
    if (search) {
      query.$or = [
        { industry: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Benchmark.countDocuments(query);
    const benchmarks = await Benchmark.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      count: benchmarks.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: benchmarks.map(formatBenchmarkData),
    });
  } catch (error) {
    next(error);
  }
};

exports.getBenchmark = async (req, res, next) => {
  try {
    const benchmark = await Benchmark.findById(req.params.id);

    if (!benchmark) {
      return res.status(404).json({ success: false, error: 'Benchmark not found' });
    }

    if (benchmark.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.json({ success: true, data: formatBenchmarkData(benchmark) });
  } catch (error) {
    next(error);
  }
};

exports.updateBenchmark = async (req, res, next) => {
  try {
    let benchmark = await Benchmark.findById(req.params.id);

    if (!benchmark) {
      return res.status(404).json({ success: false, error: 'Benchmark not found' });
    }

    if (benchmark.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    benchmark = await Benchmark.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await updateIndustryAverages(benchmark.industry);

    res.json({ success: true, data: formatBenchmarkData(benchmark) });
  } catch (error) {
    next(error);
  }
};

exports.deleteBenchmark = async (req, res, next) => {
  try {
    const benchmark = await Benchmark.findById(req.params.id);

    if (!benchmark) {
      return res.status(404).json({ success: false, error: 'Benchmark not found' });
    }

    if (benchmark.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await benchmark.deleteOne();
    await updateIndustryAverages(benchmark.industry);

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

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
      data: { industry, averages, benchmarks: benchmarks.map(formatBenchmarkData) },
    });
  } catch (error) {
    next(error);
  }
};

exports.sendAllBenchmarksReport = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const benchmarks = await Benchmark.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (benchmarks.length === 0) {
      return res.status(400).json({ success: false, error: 'No benchmarks found' });
    }

    const avgMetrics = benchmarks.reduce((acc, b) => ({
      websiteTraffic: acc.websiteTraffic + b.metrics.websiteTraffic,
      conversionRate: acc.conversionRate + b.metrics.conversionRate,
      socialMediaEngagement: acc.socialMediaEngagement + b.metrics.socialMediaEngagement,
      customerSatisfaction: acc.customerSatisfaction + b.metrics.customerSatisfaction,
      revenueGrowth: acc.revenueGrowth + b.metrics.revenueGrowth,
      operationalEfficiency: acc.operationalEfficiency + b.metrics.operationalEfficiency,
    }), { websiteTraffic: 0, conversionRate: 0, socialMediaEngagement: 0, customerSatisfaction: 0, revenueGrowth: 0, operationalEfficiency: 0 });

    Object.keys(avgMetrics).forEach(key => {
      avgMetrics[key] = (avgMetrics[key] / benchmarks.length).toFixed(2);
    });

    const html = `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px"><div style="background:linear-gradient(135deg,#007AFF 0%,#5AC8FA 100%);color:white;padding:20px;border-radius:10px"><h1>📊 Benchmark Report</h1><p>Hello ${user.name},</p></div><div style="background:#f8f9fa;padding:20px;margin:20px 0;border-radius:10px"><h2>Summary</h2><p><strong>Total:</strong> ${benchmarks.length}</p><h3>Averages</h3><div style="background:white;padding:15px;border-radius:5px"><p>Traffic: ${avgMetrics.websiteTraffic}</p><p>Conversion: ${avgMetrics.conversionRate}%</p><p>Social: ${avgMetrics.socialMediaEngagement}</p><p>Satisfaction: ${avgMetrics.customerSatisfaction}%</p><p>Revenue: ${avgMetrics.revenueGrowth}%</p><p>Efficiency: ${avgMetrics.operationalEfficiency}%</p></div><h3>Benchmarks</h3>${benchmarks.map(b => `<div style="background:white;padding:15px;margin:10px 0;border-radius:5px;border-left:4px solid #007AFF"><p><strong>${b.industry} - ${b.quarter} ${b.year}</strong></p><p style="font-size:12px;color:#666">Traffic: ${b.metrics.websiteTraffic} | Conversion: ${b.metrics.conversionRate}% | Efficiency: ${b.metrics.operationalEfficiency}%</p></div>`).join('')}</div></div>`;

    await sendEmail(user.email, `📊 Benchmark Report - ${benchmarks.length} Benchmarks`, html, 'benchmark_report', user._id);

    res.json({ success: true, message: 'Report sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send report: ' + error.message });
  }
};

const updateIndustryAverages = async (industryName) => {
  try {
    const benchmarks = await Benchmark.find({ industry: industryName });
    const averages = await calculateIndustryAverages(benchmarks);

    await Industry.findOneAndUpdate(
      { name: industryName },
      { name: industryName, averageMetrics: averages },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating industry averages:', error);
  }
};
