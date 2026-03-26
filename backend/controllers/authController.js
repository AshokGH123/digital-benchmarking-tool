exports.googleLogin = async (req, res, next) => {
  try {
    console.log("Google login body:", req.body);

    const { token } = req.body;   // ✅ FIXED HERE

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,   // ✅ FIXED HERE
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

    const jwtToken = generateToken(user);

    res.json({
      success: true,
      token: jwtToken,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
