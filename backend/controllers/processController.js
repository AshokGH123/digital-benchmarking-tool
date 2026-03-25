const Process = require('../models/Process');
const User = require('../models/User');
const { sendBenchmarkReport, sendPerformanceAlert } = require('../utils/emailService');

exports.createProcess = async (req, res, next) => {
  try {
    const { processName, benchmarkTime, benchmarkCost, actualTime, actualCost, errorRate } = req.body;

    const process = await Process.create({
      user: req.user.id,
      processName,
      benchmarkTime,
      benchmarkCost,
      actualTime,
      actualCost,
      errorRate,
    });

    const user = await User.findById(req.user.id);
    
    if (user.email && process.env.SMTP_USER) {
      try {
        await sendBenchmarkReport(process, user);
        
        if (process.healthScore < 60) {
          await sendPerformanceAlert(process, user);
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      data: process,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProcesses = async (req, res, next) => {
  try {
    const processes = await Process.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: processes.length,
      data: processes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProcess = async (req, res, next) => {
  try {
    const process = await Process.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
      });
    }

    if (process.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: process,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProcess = async (req, res, next) => {
  try {
    let process = await Process.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
      });
    }

    if (process.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    process = await Process.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: process,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProcess = async (req, res, next) => {
  try {
    const process = await Process.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        error: 'Process not found',
      });
    }

    if (process.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    await process.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    const processes = await Process.find({ user: req.user.id });
    
    const alerts = [];
    processes.forEach(process => {
      if (process.alerts && process.alerts.length > 0) {
        process.alerts.forEach(alert => {
          alerts.push({
            processId: process._id,
            processName: process.processName,
            message: alert.message,
            severity: alert.severity,
            createdAt: alert.createdAt,
          });
        });
      }
    });

    res.json({
      success: true,
      count: alerts.length,
      data: alerts.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    next(error);
  }
};
