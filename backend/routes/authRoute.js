const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, name: displayName, email } = ticket.getPayload();

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, displayName, email });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
});

module.exports = router;
