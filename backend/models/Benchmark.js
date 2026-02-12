const mongoose = require('mongoose');

const benchmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  metrics: {
    websiteTraffic: {
      type: Number,
      required: true,
      min: 0,
    },
    conversionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    socialMediaEngagement: {
      type: Number,
      required: true,
      min: 0,
    },
    customerSatisfaction: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    revenueGrowth: {
      type: Number,
      required: true,
    },
    operationalEfficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  industry: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Benchmark', benchmarkSchema);