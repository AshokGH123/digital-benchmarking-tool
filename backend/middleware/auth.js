const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/jwt');

const protect = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token',
    });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, user not found',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized, token failed',
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as admin',
    });
  }
};

module.exports = { protect, admin };
