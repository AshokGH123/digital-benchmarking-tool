const express = require('express');
const {
  getNotifications,
  sendWeeklyReport,
  resendNotification,
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/weekly-report', protect, sendWeeklyReport);
router.post('/resend/:id', protect, resendNotification);

module.exports = router;
