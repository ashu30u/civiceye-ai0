const express = require("express");
const { Complaint } = require("../models/models");
const { protect } = require("../middleware/auth");
const ai = require("../services/ai/aiService");

const router = express.Router();

// POST /api/ai/analyze  { category, description, ward }
router.post("/analyze", protect, async (req, res) => {
  try {
    const { category, description, ward } = req.body;
    if (!category) return res.status(400).json({ message: "category is required" });

    const duplicates = ward
      ? await ai.detectDuplicateComplaints(Complaint, { category, ward })
      : [];

    const analysis = ai.analyzeComplaintText({
      category,
      description,
      nearbyDuplicateCount: duplicates.length,
    });

    res.json({ analysis, duplicates });
  } catch (err) {
    res.status(500).json({ message: "AI analysis failed", error: err.message });
  }
});

// POST /api/ai/duplicate-check  { category, ward, excludeId }
router.post("/duplicate-check", protect, async (req, res) => {
  const { category, ward, excludeId } = req.body;
  const duplicates = await ai.detectDuplicateComplaints(Complaint, { category, ward, excludeId });
  res.json({ count: duplicates.length, duplicates });
});

// POST /api/ai/insight  { question, ward }  -> AI Analytics Assistant
router.post("/insight", protect, async (req, res) => {
  const { question, ward } = req.body;
  const all = await Complaint.find({ isDeleted: false }).populate("ward", "name");

  let wardMatch = null;
  if (ward) {
    const wardComplaints = all.filter((c) => c.ward && c.ward.name === ward);
    const byCat = {};
    wardComplaints.forEach((c) => (byCat[c.category] = (byCat[c.category] || 0) + 1));
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    wardMatch = {
      wardName: ward,
      topCategory: top ? top[0] : null,
      topCount: top ? top[1] : 0,
      unresolved: wardComplaints.filter((c) => c.status !== "RESOLVED").length,
    };
  }

  const criticalCount = all.filter((c) => c.severity === "CRITICAL").length;
  const catCounts = {};
  all.forEach((c) => (catCounts[c.category] = (catCounts[c.category] || 0) + 1));
  const topCategoryOverall = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const answer = ai.generateAnalyticsInsight(question || "", { wardMatch, criticalCount, topCategoryOverall });
  res.json({ answer });
});

module.exports = router;
