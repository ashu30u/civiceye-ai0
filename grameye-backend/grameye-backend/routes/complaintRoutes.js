const express = require("express");
const { Complaint, ComplaintStatusHistory, Notification, Reward, User } = require("../models/models");
const { protect, requireRole } = require("../middleware/auth");
const ai = require("../services/ai/aiService");

const router = express.Router();

async function nextComplaintCode() {
  const count = await Complaint.countDocuments();
  return `GRM-${1020 + count}`;
}

async function logStatus(complaintId, status, changedBy, note = "") {
  await ComplaintStatusHistory.create({ complaint: complaintId, status, changedBy, note });
}

async function notify(userId, message, complaintId) {
  await Notification.create({ user: userId, message, relatedComplaint: complaintId });
}

async function awardXp(userId, points, reason, complaintId) {
  await Reward.create({ user: userId, points, reason, relatedComplaint: complaintId });
  await User.findByIdAndUpdate(userId, { $inc: { xp: points } });
}

// GET /api/complaints  (filters: status, category, severity, ward, department, q)
router.get("/", protect, async (req, res) => {
  const { status, category, severity, ward, department, q } = req.query;
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (severity) filter.severity = severity;
  if (ward) filter.ward = ward;
  if (department) filter.department = department;
  if (req.user.role === "CITIZEN") filter.reporter = req.user.id;
  if (q) filter.title = { $regex: q, $options: "i" };

  const complaints = await Complaint.find(filter)
    .populate("reporter", "fullName")
    .populate("ward", "name")
    .populate("department", "name")
    .sort({ createdAt: -1 });
  res.json(complaints);
});

// GET /api/complaints/:id
router.get("/:id", protect, async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("reporter", "fullName")
    .populate("ward", "name")
    .populate("department", "name")
    .populate("assignedOfficer", "fullName");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  const history = await ComplaintStatusHistory.find({ complaint: complaint._id }).sort({ createdAt: 1 });
  res.json({ complaint, history });
});

// POST /api/complaints  (citizen creates — runs AI analysis + duplicate check server-side)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, ward, village, location, images } = req.body;
    if (!category || !ward) return res.status(400).json({ message: "category and ward are required" });

    const duplicates = await ai.detectDuplicateComplaints(Complaint, { category, ward });
    const analysis = ai.analyzeComplaintText({ category, description, nearbyDuplicateCount: duplicates.length });

    const complaintCode = await nextComplaintCode();
    const complaint = await Complaint.create({
      complaintCode,
      title: title || `${category} reported`,
      description,
      category,
      severity: analysis.severity,
      status: "PENDING",
      progress: 0,
      reporter: req.user.id,
      village, ward, location, images,
      department: null,
      aiAnalysis: {
        confidence: analysis.confidence,
        safetyRisk: analysis.safetyRisk,
        suggestedDepartment: analysis.suggestedDepartment,
        analyzedAt: new Date(),
      },
    });

    await logStatus(complaint._id, "PENDING", req.user.id, "Complaint submitted by citizen");
    await awardXp(req.user.id, 20, "Report submitted", complaint._id);

    res.status(201).json({ complaint, aiAnalysis: analysis, duplicates });
  } catch (err) {
    res.status(500).json({ message: "Could not create complaint", error: err.message });
  }
});

// PATCH /api/complaints/:id  (officer/admin generic update)
router.patch("/:id", protect, requireRole("OFFICER", "ADMIN"), async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json(complaint);
});

// POST /api/complaints/:id/assign
router.post("/:id/assign", protect, requireRole("OFFICER", "ADMIN"), async (req, res) => {
  const { departmentId, officerId } = req.body;
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { department: departmentId, assignedOfficer: officerId, status: "ASSIGNED", progress: 20 },
    { new: true }
  );
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  await logStatus(complaint._id, "ASSIGNED", req.user.id);
  await notify(complaint.reporter, `Your complaint ${complaint.complaintCode} has been assigned.`, complaint._id);
  res.json(complaint);
});

// POST /api/complaints/:id/resolve  (requires after-photo evidence)
router.post("/:id/resolve", protect, requireRole("OFFICER", "ADMIN"), async (req, res) => {
  const { afterImageUrl } = req.body;
  if (!afterImageUrl) return res.status(400).json({ message: "afterImageUrl is required to resolve a complaint" });

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  complaint.images.push({ url: afterImageUrl, type: "AFTER" });
  complaint.status = "RESOLVED";
  complaint.progress = 100;
  await complaint.save();

  await logStatus(complaint._id, "RESOLVED", req.user.id, "Resolved with after-photo evidence");
  await notify(complaint.reporter, `Your complaint ${complaint.complaintCode} has been resolved.`, complaint._id);
  res.json(complaint);
});

// POST /api/complaints/:id/reopen
router.post("/:id/reopen", protect, async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  complaint.status = "REOPENED";
  complaint.progress = 40;
  await complaint.save();

  await logStatus(complaint._id, "REOPENED", req.user.id, "Citizen indicated problem still exists");
  res.json(complaint);
});

// POST /api/complaints/:id/verify  (citizen confirms resolution -> XP)
router.post("/:id/verify", protect, async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  await awardXp(req.user.id, 50, "Verified resolved report", complaint._id);
  res.json({ message: "Verified, +50 XP awarded" });
});

module.exports = router;
