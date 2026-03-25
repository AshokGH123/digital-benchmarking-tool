const express = require('express');
const {
  createProcess,
  getProcesses,
  getProcess,
  updateProcess,
  deleteProcess,
  getAlerts,
} = require('../controllers/processController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProcesses)
  .post(protect, createProcess);

router.get('/alerts', protect, getAlerts);

router.route('/:id')
  .get(protect, getProcess)
  .put(protect, updateProcess)
  .delete(protect, deleteProcess);

module.exports = router;
