const express = require('express');
const { getDashboardData, getAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getDashboardData);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
