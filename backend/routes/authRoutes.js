const express = require('express');
const { register, login, googleLogin, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, profileValidation } = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);

module.exports = router;
