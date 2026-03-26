exports.googleLogin = async (req, res) => {
  try {
    console.log("Google login body:", req.body);

    const { token } = req.body;

    // 🔒 Validate token
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token missing",
      });
    }

    // 🔐 Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        error: "Invalid Google token",
      });
    }

    // 🔍 Check user
    let user = await User.findOne({ email: payload.email });

    // 🆕 Create user if not exists
    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email: payload.email,
        password: Math.random().toString(36).slice(-8),
        company: 'N/A',
        industry: 'Technology',
      });
    }

    // 🔑 Generate JWT
    const jwtToken = generateToken(user);

    // ✅ Send response
    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: formatUser(user),
    });

  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      success: false,
      error: "Google authentication failed",
    });
  }
};
