require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const benchmarkRoutes = require('./routes/benchmarkRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const processRoutes = require('./routes/processRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Body parser
app.use(express.json());

// CORS
const cors = require('cors');

app.use(cors({
  origin: true,  // allow all origins (fix for now)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// VERY IMPORTANT → handle preflight manually
app.options('*', cors());

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/notifications', emailRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
