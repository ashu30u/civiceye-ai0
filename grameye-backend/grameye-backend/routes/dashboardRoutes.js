const express = require("express");
const { Complaint, Notification, User } = require("../models/models");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/dashboard/citizen
router.get("/citizen", protect, async (req, res) => {
  const mine = await Complaint.find({ reporter: req.user.id, isDeleted: false })
    .populate("ward", "name")
    .sort({ createdAt: -1 });

  const resolved = mine.filter((c) => c.status === "RESOLVED").length;
  const inProgress = mine.filter((c) => ["ASSIGNED", "IN_PROGRESS"].includes(c.status)).length;
  const pending = mine.filter((c) => ["PENDING", "VERIFIED"].includes(c.status)).length;

  const user = await User.findById(req.user.id).select("fullName xp badges");
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);

  res.json({
    user,
    stats: { total: mine.length, resolved, inProgress, pending },
    recentComplaints: mine.slice(0, 10),
    notifications,
  });
});

// GET /api/dashboard/admin
router.get("/admin", protect, requireRole("OFFICER", "ADMIN"), async (req, res) => {
  const all = await Complaint.find({ isDeleted: false }).populate("ward", "name").populate("department", "name");

  const total = all.length;
  const pending = all.filter((c) => c.status === "PENDING").length;
  const inProgress = all.filter((c) => ["ASSIGNED", "IN_PROGRESS"].includes(c.status)).length;
  const resolved = all.filter((c) => c.status === "RESOLVED").length;
  const critical = all.filter((c) => c.severity === "CRITICAL" || c.severity === "HIGH").length;

  res.json({
    stats: {
      total, pending, inProgress, resolved, critical,
      resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    },
    complaints: all.slice(0, 50),
  });
});

module.exports = router;
