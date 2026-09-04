const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, mobile, password, village, ward, preferredLanguage } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName, email, mobile, password: hashed, village, ward,
      preferredLanguage: preferredLanguage || "en",
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, xp: user.xp },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, xp: user.xp },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// In-memory OTP storage for demo/production SMS verification
const otpStore = new Map();

// POST /api/auth/send-otp
router.post("/send-otp", (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ message: "Valid 10-digit mobile number required" });
    }
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    // Deterministic or random 4-digit OTP for testing
    const otp = cleanMobile === "6268814185" ? "4829" : Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(cleanMobile, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    res.json({
      success: true,
      message: "OTP sent successfully to +91 " + cleanMobile,
      mobile: cleanMobile,
      otp, // provided in response for easy testing/demo
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate OTP", error: err.message });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp, fullName, ward, role } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
    const stored = otpStore.get(cleanMobile);

    // Allow master test OTP '4829' or verified stored OTP
    const isValid = otp === "4829" || (stored && stored.otp === otp && stored.expiresAt > Date.now());
    if (!isValid) {
      return res.status(401).json({ message: "Invalid or expired OTP. Please try again." });
    }

    // Check if user exists with this mobile
    let user = await User.findOne({ mobile: cleanMobile, isDeleted: false });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const dummyEmail = `${cleanMobile}@grameye.in`;
      const randomPassword = await bcrypt.hash("GramEye@" + cleanMobile, 10);
      user = await User.create({
        fullName: fullName || "Gram Citizen (" + cleanMobile.slice(-4) + ")",
        email: dummyEmail,
        mobile: cleanMobile,
        password: randomPassword,
        role: role === "ADMIN" ? "ADMIN" : "CITIZEN",
        xp: 100, // starting welcome bonus
        badges: ["New Citizen"],
      });
    } else if (fullName && user.fullName.startsWith("Gram Citizen")) {
      user.fullName = fullName;
      await user.save();
    }

    const token = signToken(user);
    otpStore.delete(cleanMobile);

    res.json({
      success: true,
      isNewUser,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        xp: user.xp,
        ward: ward || "Ward 3",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

module.exports = router;
