const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array();
    return res.status(400).json({
      success: false,
      error: formattedErrors[0].msg,
      errors: formattedErrors,
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const profileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('company').optional().trim().notEmpty().withMessage('Company cannot be empty'),
  body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
  validate,
];

const benchmarkValidation = [
  body('metrics.websiteTraffic').isNumeric().withMessage('Website traffic must be a number'),
  body('metrics.conversionRate').isFloat({ min: 0, max: 100 }).withMessage('Conversion rate must be between 0 and 100'),
  body('metrics.socialMediaEngagement').isNumeric().withMessage('Social media engagement must be a number'),
  body('metrics.customerSatisfaction').isFloat({ min: 0, max: 100 }).withMessage('Customer satisfaction must be between 0 and 100'),
  body('metrics.revenueGrowth').isNumeric().withMessage('Revenue growth must be a number'),
  body('metrics.operationalEfficiency').isFloat({ min: 0, max: 100 }).withMessage('Operational efficiency must be between 0 and 100'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('quarter').isIn(['Q1', 'Q2', 'Q3', 'Q4']).withMessage('Quarter must be Q1, Q2, Q3, or Q4'),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year is required'),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  benchmarkValidation,
};
