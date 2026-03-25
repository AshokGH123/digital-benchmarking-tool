const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  processName: {
    type: String,
    required: true,
  },
  benchmarkTime: {
    type: Number,
    required: true,
  },
  benchmarkCost: {
    type: Number,
    required: true,
  },
  actualTime: {
    type: Number,
    required: true,
  },
  actualCost: {
    type: Number,
    required: true,
  },
  errorRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  healthScore: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Good', 'Moderate', 'Poor'],
    default: 'Good',
  },
  alerts: [{
    message: String,
    severity: String,
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

processSchema.pre('save', function(next) {
  const timeScore = (this.benchmarkTime / this.actualTime) * 100;
  const costScore = (this.benchmarkCost / this.actualCost) * 100;
  const qualityScore = 100 - this.errorRate;
  
  this.healthScore = Math.round((timeScore + costScore + qualityScore) / 3);
  
  if (this.healthScore > 80) {
    this.status = 'Good';
  } else if (this.healthScore >= 60) {
    this.status = 'Moderate';
  } else {
    this.status = 'Poor';
  }
  
  this.alerts = [];
  if (this.actualTime > this.benchmarkTime) {
    this.alerts.push({
      message: `Process time exceeded benchmark by ${(this.actualTime - this.benchmarkTime).toFixed(1)} hours`,
      severity: 'warning',
    });
  }
  if (this.actualCost > this.benchmarkCost) {
    this.alerts.push({
      message: `Process cost exceeded benchmark by $${(this.actualCost - this.benchmarkCost).toFixed(2)}`,
      severity: 'warning',
    });
  }
  if (this.healthScore < 60) {
    this.alerts.push({
      message: `Critical: Health score is ${this.healthScore}% - Immediate action required`,
      severity: 'critical',
    });
  }
  
  next();
});

module.exports = mongoose.model('Process', processSchema);
