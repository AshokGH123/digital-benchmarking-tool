const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  company: user.company,
  industry: user.industry,
  role: user.role,
});

// REGISTER
const register = async (req, res) => {
  const { name, email, password, company, industry } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ error: 'User exists' });

  const user = await User.create({ name, email, password, company, industry });

  res.json({
    token: generateToken(user),
    user: formatUser(user),
  });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    token: generateToken(user),
    user: formatUser(user),
  });
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      password: Math.random().toString(36).slice(-8),
      company: 'N/A',
      industry: 'Technology',
    });
  }

  res.json({
    token: generateToken(user),
    user: formatUser(user),
  });
};

// GET ME
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: formatUser(user) });
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
  res.json({ user: formatUser(user) });
};

// ✅ EXPORT EVERYTHING (CRITICAL)
module.exports = {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
};
