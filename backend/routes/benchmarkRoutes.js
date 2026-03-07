const express = require('express');
const {
  createBenchmark,
  getBenchmarks,
  getBenchmark,
  updateBenchmark,
  deleteBenchmark,
  getIndustryBenchmarks,
} = require('../controllers/benchmarkController');
const { protect } = require('../middleware/auth');
const { benchmarkValidation } = require('../middleware/validation');

const router = express.Router();

router.route('/')
  .get(protect, getBenchmarks)
  .post(protect, benchmarkValidation, createBenchmark);

router.route('/:id')
  .get(protect, getBenchmark)
  .put(protect, benchmarkValidation, updateBenchmark)
  .delete(protect, deleteBenchmark);

router.get('/industry/:industry', protect, getIndustryBenchmarks);

module.exports = router;
