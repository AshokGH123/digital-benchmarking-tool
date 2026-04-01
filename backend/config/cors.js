const cors = require('cors');

const defaultOrigins = ['http://localhost:3000'];

const configuredOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : defaultOrigins;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
