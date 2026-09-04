const express = require("express");
const { User, Reward } = require("../models/models");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/rewards/leaderboard?period=weekly|monthly|alltime
router.get("/leaderboard", protect, async (req, res) => {
  const { period } = req.query;
  let dateFilter = {};
  const now = new Date();
  if (period === "weekly") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: weekAgo } };
  } else if (period === "monthly") {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { $gte: monthAgo } };
  }

  if (period === "alltime" || !period) {
    const users = await User.find({ isDeleted: false }).select("fullName xp badges").sort({ xp: -1 }).limit(20);
    return res.json(users);
  }

  const rewards = await Reward.find(dateFilter);
  const totals = {};
  rewards.forEach((r) => {
    totals[r.user] = (totals[r.user] || 0) + r.points;
  });
  const userIds = Object.keys(totals);
  const users = await User.find({ _id: { $in: userIds } }).select("fullName badges");
  const leaderboard = users
    .map((u) => ({ id: u._id, fullName: u.fullName, badges: u.badges, xp: totals[u._id] || 0 }))
    .sort((a, b) => b.xp - a.xp);

  res.json(leaderboard);
});

// POST /api/rewards/claim  { badgeName }
router.post("/claim", protect, async (req, res) => {
  const { badgeName } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.badges.includes(badgeName)) {
    user.badges.push(badgeName);
    await user.save();
  }
  res.json({ message: `${badgeName} claimed`, badges: user.badges });
});

module.exports = router;
