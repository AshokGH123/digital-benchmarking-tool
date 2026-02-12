const express = require('express');
const router = express.Router();
const {
  createBenchmark,
  getBenchmarks,
  getBenchmark,
  updateBenchmark,
  deleteBenchmark,
  getIndustryBenchmarks,
} = require('../controllers/benchmarkController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { benchmarkValidator } = require('../utils/validators');

router.use(protect);

router.route('/')
  .post(benchmarkValidator, validate, createBenchmark)
  .get(getBenchmarks);

router.get('/industry/:industry', getIndustryBenchmarks);

router.route('/:id')
  .get(getBenchmark)
  .put(benchmarkValidator, validate, updateBenchmark)
  .delete(deleteBenchmark);

module.exports = router;
