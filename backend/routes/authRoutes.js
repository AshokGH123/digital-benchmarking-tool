const express = require('express');
const { register, login, googleLogin, getMe, updateProfile } = require('../controllers/authController');

const router = express.Router();

// ✅ REMOVE ALL MIDDLEWARE TEMPORARILY
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', getMe);
router.put('/profile', updateProfile);

module.exports = router;
