const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  averageMetrics: {
    websiteTraffic: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    socialMediaEngagement: { type: Number, default: 0 },
    customerSatisfaction: { type: Number, default: 0 },
    revenueGrowth: { type: Number, default: 0 },
    operationalEfficiency: { type: Number, default: 0 },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Industry', industrySchema);
