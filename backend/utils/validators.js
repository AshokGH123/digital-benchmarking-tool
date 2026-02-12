const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('company')
    .notEmpty()
    .withMessage('Company name is required'),
  
  body('industry')
    .notEmpty()
    .withMessage('Industry is required'),
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const benchmarkValidator = [
  body('metrics.websiteTraffic')
    .isFloat({ min: 0 })
    .withMessage('Website traffic must be a positive number'),
  
  body('metrics.conversionRate')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Conversion rate must be between 0 and 100'),
  
  body('metrics.socialMediaEngagement')
    .isFloat({ min: 0 })
    .withMessage('Social media engagement must be a positive number'),
  
  body('metrics.customerSatisfaction')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Customer satisfaction must be between 0 and 100'),
  
  body('metrics.revenueGrowth')
    .isFloat()
    .withMessage('Revenue growth must be a number'),
  
  body('metrics.operationalEfficiency')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Operational efficiency must be between 0 and 100'),
  
  body('industry')
    .notEmpty()
    .withMessage('Industry is required'),
  
  body('quarter')
    .isIn(['Q1', 'Q2', 'Q3', 'Q4'])
    .withMessage('Quarter must be Q1, Q2, Q3, or Q4'),
  
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be valid'),
];

module.exports = {
  registerValidator,
  loginValidator,
  benchmarkValidator,
};